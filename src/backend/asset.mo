import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Float "mo:base/Float";

actor Asset {
    private type FarmAsset = {
        id: Text;
        farmerId: Principal;
        assetType: Text;
        location: Text;
        size: Float; // in hectares
        valuation: Nat;
        status: AssetStatus;
        registrationDate: Int;
    };

    private type AssetStatus = {
        #Available;
        #Invested;
        #Sold;
    };

    private stable var nextAssetId: Nat = 0;
    private var assets = Buffer.Buffer<FarmAsset>(0);

    // Register a new farm asset
    public shared(msg) func registerAsset(assetType: Text, location: Text, size: Float, valuation: Nat) : async Result.Result<Text, Text> {
        let farmer = msg.caller;
        
        if (Principal.isAnonymous(farmer)) {
            return #err("Anonymous principals not allowed");
        };

        let assetId = nextAssetId;
        nextAssetId += 1;

        let asset: FarmAsset = {
            id = Nat.toText(assetId);
            farmerId = farmer;
            assetType = assetType;
            location = location;
            size = size;
            valuation = valuation;
            status = #Available;
            registrationDate = Time.now();
        };

        assets.add(asset);
        #ok(asset.id)
    };

    // Get asset details
    public query func getAsset(id: Text) : async Result.Result<FarmAsset, Text> {
        var assetIndex: Nat = 0;
        var found = false;
        
        label findAsset for (asset in assets.vals()) {
            if (Text.equal(asset.id, id)) {
                found := true;
                break findAsset;
            };
            assetIndex += 1;
        };

        if (not found) {
            return #err("Asset not found");
        };

        #ok(assets.get(assetIndex))
    };

    // Get assets by farmer
    public query func getAssetsByFarmer(farmerId: Principal) : async [FarmAsset] {
        let farmerAssets = Buffer.Buffer<FarmAsset>(0);
        
        for (asset in assets.vals()) {
            if (Principal.equal(asset.farmerId, farmerId)) {
                farmerAssets.add(asset);
            };
        };

        Buffer.toArray(farmerAssets)
    };

    // Update asset status
    public shared(msg) func updateAssetStatus(id: Text, newStatus: AssetStatus) : async Result.Result<(), Text> {
        var assetIndex: Nat = 0;
        var found = false;
        
        label findAsset for (asset in assets.vals()) {
            if (Text.equal(asset.id, id)) {
                found := true;
                break findAsset;
            };
            assetIndex += 1;
        };

        if (not found) {
            return #err("Asset not found");
        };

        let asset = assets.get(assetIndex);
        
        // Only farmer can update their asset
        if (not Principal.equal(msg.caller, asset.farmerId)) {
            return #err("Only the farmer can update the asset status");
        };

        let updatedAsset: FarmAsset = {
            id = asset.id;
            farmerId = asset.farmerId;
            assetType = asset.assetType;
            location = asset.location;
            size = asset.size;
            valuation = asset.valuation;
            status = newStatus;
            registrationDate = asset.registrationDate;
        };

        assets.put(assetIndex, updatedAsset);
        #ok(())
    };

    // Get all available assets
    public query func getAvailableAssets() : async [FarmAsset] {
        let availableAssets = Buffer.Buffer<FarmAsset>(0);
        
        for (asset in assets.vals()) {
            switch (asset.status) {
                case (#Available) { availableAssets.add(asset) };
                case (_) {};
            };
        };

        Buffer.toArray(availableAssets)
    };
}
