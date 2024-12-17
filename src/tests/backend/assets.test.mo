import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import DafiAssets "../backend/assets";

actor {
    let assets = await DafiAssets.DafiAssets();

    // Test asset token minting
    public func testMintToken() : async () {
        Debug.print("Testing token minting...");

        let result = await assets.mintToken(
            "asset123",
            100
        );

        switch (result) {
            case (#ok(tokenId)) {
                assert(tokenId == 0);
                Debug.print("✓ Token minting successful");
            };
            case (#err(message)) {
                Debug.print("✗ Token minting failed: " # message);
                assert(false);
            };
        };
    };

    // Test token transfer
    public func testTransferToken() : async () {
        Debug.print("Testing token transfer...");

        // First mint a token
        let mintResult = await assets.mintToken(
            "asset123",
            100
        );

        switch (mintResult) {
            case (#ok(tokenId)) {
                // Try to transfer the token
                let recipient = Principal.fromText("aaaaa-aa");
                let transferResult = await assets.transferToken(
                    tokenId,
                    recipient
                );

                switch (transferResult) {
                    case (#ok()) {
                        Debug.print("✓ Token transfer successful");
                    };
                    case (#err(message)) {
                        Debug.print("✗ Token transfer failed: " # message);
                        assert(false);
                    };
                };
            };
            case (#err(message)) {
                Debug.print("✗ Token minting failed: " # message);
                assert(false);
            };
        };
    };

    // Test asset metrics update
    public func testUpdateMetrics() : async () {
        Debug.print("Testing metrics update...");

        let metrics = {
            temperature = ?25.5;
            humidity = ?60.0;
            soilMoisture = ?40.0;
            ph = ?6.8;
            nutrients = ?{
                nitrogen = 20.0;
                phosphorus = 15.0;
                potassium = 25.0;
            };
        };

        let result = await assets.updateMetrics(
            "asset123",
            metrics
        );

        switch (result) {
            case (#ok()) {
                Debug.print("✓ Metrics update successful");
            };
            case (#err(message)) {
                Debug.print("✗ Metrics update failed: " # message);
                assert(false);
            };
        };
    };

    // Test asset history retrieval
    public func testGetAssetHistory() : async () {
        Debug.print("Testing history retrieval...");

        let history = await assets.getAssetHistory("asset123");
        assert(history.size() > 0);
        Debug.print("✓ History retrieval successful");
    };

    // Test user token retrieval
    public func testGetUserTokens() : async () {
        Debug.print("Testing user token retrieval...");

        let userTokens = await assets.getUserTokens(Principal.fromActor(assets));
        assert(userTokens.size() > 0);
        Debug.print("✓ User token retrieval successful");
    };

    // Run all tests
    public func runTests() : async () {
        Debug.print("Running all tests...");
        
        await testMintToken();
        await testTransferToken();
        await testUpdateMetrics();
        await testGetAssetHistory();
        await testGetUserTokens();

        Debug.print("All tests completed!");
    };
};
