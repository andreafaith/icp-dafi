import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat16 "mo:base/Nat16";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";

actor KYC {
    private type Document = {
        id: Text;
        documentType: Text;
        data: Text;
        uploadTime: Int;
    };

    private type VerificationStatus = {
        #Pending;
        #Approved;
        #Rejected;
    };

    private type UserKYC = {
        principal: Principal;
        documents: Buffer.Buffer<Document>;
        status: VerificationStatus;
        verificationTime: ?Int;
    };

    private type HeaderField = (Text, Text);

    private type HttpRequest = {
        method: Text;
        url: Text;
        headers: [HeaderField];
        body: Blob;
    };

    private type HttpResponse = {
        status_code: Nat16;
        headers: [HeaderField];
        body: Blob;
        streaming_strategy: ?StreamingStrategy;
    };

    private type StreamingCallback = shared () -> async StreamingCallbackResponse;

    private type StreamingStrategy = {
        #Callback: {
            callback: StreamingCallback;
            token: StreamingCallbackToken;
        };
    };

    private type StreamingCallbackToken = {
        key: Text;
        sha256: ?Blob;
        index: Nat;
        content_encoding: Text;
    };

    private type StreamingCallbackResponse = {
        body: Blob;
        token: ?StreamingCallbackToken;
    };

    private stable var nextDocId: Nat = 0;
    private var users = Buffer.Buffer<UserKYC>(0);

    public query func http_request(request: HttpRequest) : async HttpResponse {
        {
            body = Text.encodeUtf8("Welcome to KYC Canister");
            headers = [("Content-Type", "text/plain")];
            status_code = Nat16.fromNat(200);
            streaming_strategy = null;
        }
    };

    // Add a new KYC document for a user
    public shared(msg) func addDocument(docType: Text, data: Text) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals not allowed");
        };

        let docId = nextDocId;
        nextDocId += 1;

        let document: Document = {
            id = Nat.toText(docId);
            documentType = docType;
            data = data;
            uploadTime = Time.now();
        };

        var userIndex: Nat = 0;
        var userFound = false;
        
        label findUser for (i in users.vals()) {
            if (Principal.equal(i.principal, caller)) {
                userFound := true;
                break findUser;
            };
            userIndex += 1;
        };

        if (not userFound) {
            let newUserDocs = Buffer.Buffer<Document>(0);
            newUserDocs.add(document);
            
            let newUser: UserKYC = {
                principal = caller;
                documents = newUserDocs;
                status = #Pending;
                verificationTime = null;
            };
            users.add(newUser);
        } else {
            let user = users.get(userIndex);
            user.documents.add(document);
            users.put(userIndex, user);
        };

        #ok(document.id)
    };

    // Get user's KYC status
    public query(msg) func getStatus() : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals not allowed");
        };

        for (user in users.vals()) {
            if (Principal.equal(user.principal, caller)) {
                switch (user.status) {
                    case (#Pending) { return #ok("Pending") };
                    case (#Approved) { return #ok("Approved") };
                    case (#Rejected) { return #ok("Rejected") };
                };
            };
        };

        #err("User not found")
    };

    // Admin function to verify KYC
    public shared(msg) func verifyKYC(userPrincipal: Principal, approved: Bool) : async Result.Result<(), Text> {
        // TODO: Add proper admin checks
        if (Principal.isAnonymous(msg.caller)) {
            return #err("Anonymous principals not allowed");
        };

        var userIndex: Nat = 0;
        var userFound = false;
        
        label findUser for (user in users.vals()) {
            if (Principal.equal(user.principal, userPrincipal)) {
                userFound := true;
                break findUser;
            };
            userIndex += 1;
        };

        if (not userFound) {
            return #err("User not found");
        };

        let user = users.get(userIndex);
        let updatedUser: UserKYC = {
            principal = user.principal;
            documents = user.documents;
            status = if (approved) { #Approved } else { #Rejected };
            verificationTime = ?Time.now();
        };
        users.put(userIndex, updatedUser);

        #ok(())
    };
}
