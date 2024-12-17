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

actor DafiMain {
    // Types
    type AssetId = Text;
    type UserId = Principal;
    
    type Location = {
        latitude: Float;
        longitude: Float;
        altitude: ?Float;
    };

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

    type Asset = {
        id: AssetId;
        owner: UserId;
        name: Text;
        assetType: {#farm; #crop; #equipment};
        location: Location;
        status: {#active; #inactive; #maintenance};
        metrics: ?AssetMetrics;
        value: Nat;
        created: Int;
        updated: Int;
    };

    type User = {
        id: UserId;
        role: {#farmer; #investor; #admin};
        assets: [AssetId];
        investments: [AssetId];
        created: Int;
    };

    // State
    private stable var nextAssetId: Nat = 0;
    private var assets = HashMap.HashMap<AssetId, Asset>(0, Text.equal, Text.hash);
    private var users = HashMap.HashMap<UserId, User>(0, Principal.equal, Principal.hash);

    // Asset Management
    public shared(msg) func createAsset(
        name: Text,
        assetType: {#farm; #crop; #equipment},
        location: Location,
        value: Nat
    ): async Result.Result<AssetId, Text> {
        // Authorization check
        switch (users.get(msg.caller)) {
            case (?user) {
                if (user.role != #farmer and user.role != #admin) {
                    return #err("Unauthorized: Only farmers and admins can create assets");
                };
            };
            case null {
                return #err("Unauthorized: User not found");
            };
        };

        let assetId = Int.toText(nextAssetId);
        nextAssetId += 1;

        let asset: Asset = {
            id = assetId;
            owner = msg.caller;
            name = name;
            assetType = assetType;
            location = location;
            status = #active;
            metrics = null;
            value = value;
            created = Time.now();
            updated = Time.now();
        };

        assets.put(assetId, asset);
        
        // Update user's assets
        switch (users.get(msg.caller)) {
            case (?user) {
                let updatedUser = {
                    id = user.id;
                    role = user.role;
                    assets = Array.append<AssetId>(user.assets, [assetId]);
                    investments = user.investments;
                    created = user.created;
                };
                users.put(msg.caller, updatedUser);
            };
            case null {};
        };

        #ok(assetId)
    };

    public query func getAsset(id: AssetId): async ?Asset {
        assets.get(id)
    };

    public shared(msg) func updateAsset(
        id: AssetId,
        name: ?Text,
        status: ?{#active; #inactive; #maintenance},
        metrics: ?AssetMetrics,
        value: ?Nat
    ): async Result.Result<(), Text> {
        switch (assets.get(id)) {
            case (?asset) {
                // Authorization check
                if (asset.owner != msg.caller) {
                    return #err("Unauthorized: Only asset owner can update");
                };

                let updatedAsset: Asset = {
                    id = asset.id;
                    owner = asset.owner;
                    name = Option.get(name, asset.name);
                    assetType = asset.assetType;
                    location = asset.location;
                    status = Option.get(status, asset.status);
                    metrics = Option.get(metrics, asset.metrics);
                    value = Option.get(value, asset.value);
                    created = asset.created;
                    updated = Time.now();
                };

                assets.put(id, updatedAsset);
                #ok(())
            };
            case null {
                #err("Asset not found")
            };
        }
    };

    // User Management
    public shared(msg) func createUser(
        role: {#farmer; #investor; #admin}
    ): async Result.Result<(), Text> {
        switch (users.get(msg.caller)) {
            case (?_) {
                #err("User already exists")
            };
            case null {
                let user: User = {
                    id = msg.caller;
                    role = role;
                    assets = [];
                    investments = [];
                    created = Time.now();
                };
                users.put(msg.caller, user);
                #ok(())
            };
        }
    };

    public query func getUser(id: UserId): async ?User {
        users.get(id)
    };

    // Investment Management
    public shared(msg) func invest(
        assetId: AssetId
    ): async Result.Result<(), Text> {
        // Authorization check
        switch (users.get(msg.caller)) {
            case (?user) {
                if (user.role != #investor) {
                    return #err("Unauthorized: Only investors can invest");
                };
            };
            case null {
                return #err("Unauthorized: User not found");
            };
        };

        switch (assets.get(assetId)) {
            case (?asset) {
                // Update user's investments
                switch (users.get(msg.caller)) {
                    case (?user) {
                        let updatedUser = {
                            id = user.id;
                            role = user.role;
                            assets = user.assets;
                            investments = Array.append<AssetId>(user.investments, [assetId]);
                            created = user.created;
                        };
                        users.put(msg.caller, updatedUser);
                        #ok(())
                    };
                    case null {
                        #err("User not found")
                    };
                }
            };
            case null {
                #err("Asset not found")
            };
        }
    };

    // Query Functions
    public query func getAllAssets(): async [Asset] {
        Iter.toArray(assets.vals())
    };

    public query func getUserAssets(userId: UserId): async [Asset] {
        switch (users.get(userId)) {
            case (?user) {
                Array.mapFilter<AssetId, Asset>(
                    user.assets,
                    func (id: AssetId): ?Asset = assets.get(id)
                )
            };
            case null { [] };
        }
    };

    public query func getUserInvestments(userId: UserId): async [Asset] {
        switch (users.get(userId)) {
            case (?user) {
                Array.mapFilter<AssetId, Asset>(
                    user.investments,
                    func (id: AssetId): ?Asset = assets.get(id)
                )
            };
            case null { [] };
        }
    };

    // System Functions
    public query func getMemorySize(): async Nat {
        let assetsSize = assets.size();
        let usersSize = users.size();
        assetsSize + usersSize
    };

    system func preupgrade() {
        // Implement state preservation logic
    };

    system func postupgrade() {
        // Implement state recovery logic
    };
}
