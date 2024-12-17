import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";

actor DafiAssets {
    type AssetId = Text;
    type TokenId = Nat;
    
    type AssetMetrics = {
        temperature: ?Float;
        humidity: ?Float;
        soilMoisture: ?Float;
        ph: ?Float;
        nutrients: ?{
            nitrogen: Float;
            phosphorus: Float;
            potassium: Float;
        };
    };

    type AssetToken = {
        tokenId: TokenId;
        assetId: AssetId;
        owner: Principal;
        shares: Nat;
        created: Int;
    };

    type AssetHistory = {
        timestamp: Int;
        eventType: {#created; #transferred; #updated; #metrics};
        data: Text;
    };

    private stable var nextTokenId: TokenId = 0;
    private var tokens = HashMap.HashMap<TokenId, AssetToken>(0, Nat.equal, Hash.hash);
    private var assetTokens = HashMap.HashMap<AssetId, [TokenId]>(0, Text.equal, Text.hash);
    private var history = HashMap.HashMap<AssetId, Buffer.Buffer<AssetHistory>>(0, Text.equal, Text.hash);

    // Token Management
    public shared(msg) func mintToken(
        assetId: AssetId,
        shares: Nat
    ): async Result.Result<TokenId, Text> {
        let tokenId = nextTokenId;
        nextTokenId += 1;

        let token: AssetToken = {
            tokenId = tokenId;
            assetId = assetId;
            owner = msg.caller;
            shares = shares;
            created = Time.now();
        };

        tokens.put(tokenId, token);

        // Update asset tokens mapping
        switch (assetTokens.get(assetId)) {
            case (?existingTokens) {
                assetTokens.put(assetId, Array.append(existingTokens, [tokenId]));
            };
            case null {
                assetTokens.put(assetId, [tokenId]);
            };
        };

        // Record history
        recordHistory(assetId, #created, "Token minted: " # Int.toText(tokenId));

        #ok(tokenId)
    };

    public shared(msg) func transferToken(
        tokenId: TokenId,
        to: Principal
    ): async Result.Result<(), Text> {
        switch (tokens.get(tokenId)) {
            case (?token) {
                if (token.owner != msg.caller) {
                    return #err("Unauthorized: Only token owner can transfer");
                };

                let updatedToken: AssetToken = {
                    tokenId = token.tokenId;
                    assetId = token.assetId;
                    owner = to;
                    shares = token.shares;
                    created = token.created;
                };

                tokens.put(tokenId, updatedToken);
                recordHistory(token.assetId, #transferred, 
                    "Token " # Int.toText(tokenId) # " transferred to " # Principal.toText(to));

                #ok(())
            };
            case null {
                #err("Token not found")
            };
        }
    };

    // Asset Metrics
    public shared(msg) func updateMetrics(
        assetId: AssetId,
        metrics: AssetMetrics
    ): async Result.Result<(), Text> {
        // Verify caller owns tokens for this asset
        let hasTokens = switch (assetTokens.get(assetId)) {
            case (?tokenIds) {
                Array.find<TokenId>(
                    tokenIds,
                    func (id: TokenId): Bool {
                        switch (tokens.get(id)) {
                            case (?token) { token.owner == msg.caller };
                            case null { false };
                        }
                    }
                ) != null;
            };
            case null { false };
        };

        if (not hasTokens) {
            return #err("Unauthorized: Caller does not own any tokens for this asset");
        };

        recordHistory(assetId, #metrics, "Metrics updated");
        #ok(())
    };

    // History Management
    private func recordHistory(
        assetId: AssetId,
        eventType: {#created; #transferred; #updated; #metrics},
        data: Text
    ) {
        let event: AssetHistory = {
            timestamp = Time.now();
            eventType = eventType;
            data = data;
        };

        switch (history.get(assetId)) {
            case (?buffer) {
                buffer.add(event);
            };
            case null {
                let buffer = Buffer.Buffer<AssetHistory>(0);
                buffer.add(event);
                history.put(assetId, buffer);
            };
        };
    };

    // Query Functions
    public query func getToken(tokenId: TokenId): async ?AssetToken {
        tokens.get(tokenId)
    };

    public query func getAssetTokens(assetId: AssetId): async [TokenId] {
        switch (assetTokens.get(assetId)) {
            case (?tokenIds) { tokenIds };
            case null { [] };
        }
    };

    public query func getAssetHistory(assetId: AssetId): async [AssetHistory] {
        switch (history.get(assetId)) {
            case (?buffer) { Buffer.toArray(buffer) };
            case null { [] };
        }
    };

    public query func getUserTokens(user: Principal): async [AssetToken] {
        Iter.toArray(
            Iter.filter<AssetToken>(
                tokens.vals(),
                func (token: AssetToken): Bool {
                    token.owner == user
                }
            )
        )
    };

    // System Functions
    system func preupgrade() {
        // Implement state preservation
    };

    system func postupgrade() {
        // Implement state recovery
    };
}
