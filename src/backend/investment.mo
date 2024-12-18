import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Float "mo:base/Float";

actor Investment {
    private type Investment = {
        id: Text;
        farmerId: Principal;
        investorId: Principal;
        amount: Nat;
        interestRate: Float;
        startDate: Int;
        duration: Int; // in seconds
        status: InvestmentStatus;
    };

    private type InvestmentStatus = {
        #Active;
        #Completed;
        #Defaulted;
    };

    private stable var nextInvestmentId: Nat = 0;
    private var investments = Buffer.Buffer<Investment>(0);

    // Create a new investment
    public shared(msg) func createInvestment(farmerId: Principal, amount: Nat, interestRate: Float, duration: Int) : async Result.Result<Text, Text> {
        let investor = msg.caller;
        
        if (Principal.isAnonymous(investor)) {
            return #err("Anonymous principals not allowed");
        };

        let investmentId = nextInvestmentId;
        nextInvestmentId += 1;

        let investment: Investment = {
            id = Nat.toText(investmentId);
            farmerId = farmerId;
            investorId = investor;
            amount = amount;
            interestRate = interestRate;
            startDate = Time.now();
            duration = duration;
            status = #Active;
        };

        investments.add(investment);
        #ok(investment.id)
    };

    // Get investment details
    public query func getInvestment(id: Text) : async Result.Result<Investment, Text> {
        var investmentIndex: Nat = 0;
        var found = false;
        
        label findInvestment for (investment in investments.vals()) {
            if (Text.equal(investment.id, id)) {
                found := true;
                break findInvestment;
            };
            investmentIndex += 1;
        };

        if (not found) {
            return #err("Investment not found");
        };

        #ok(investments.get(investmentIndex))
    };

    // Get investments by farmer
    public query func getInvestmentsByFarmer(farmerId: Principal) : async [Investment] {
        let farmerInvestments = Buffer.Buffer<Investment>(0);
        
        for (investment in investments.vals()) {
            if (Principal.equal(investment.farmerId, farmerId)) {
                farmerInvestments.add(investment);
            };
        };

        Buffer.toArray(farmerInvestments)
    };

    // Get investments by investor
    public query func getInvestmentsByInvestor(investorId: Principal) : async [Investment] {
        let investorInvestments = Buffer.Buffer<Investment>(0);
        
        for (investment in investments.vals()) {
            if (Principal.equal(investment.investorId, investorId)) {
                investorInvestments.add(investment);
            };
        };

        Buffer.toArray(investorInvestments)
    };

    // Complete an investment
    public shared(msg) func completeInvestment(id: Text) : async Result.Result<(), Text> {
        var investmentIndex: Nat = 0;
        var found = false;
        
        label findInvestment for (investment in investments.vals()) {
            if (Text.equal(investment.id, id)) {
                found := true;
                break findInvestment;
            };
            investmentIndex += 1;
        };

        if (not found) {
            return #err("Investment not found");
        };

        let investment = investments.get(investmentIndex);
        
        // Only farmer can complete the investment
        if (not Principal.equal(msg.caller, investment.farmerId)) {
            return #err("Only the farmer can complete the investment");
        };

        let updatedInvestment: Investment = {
            id = investment.id;
            farmerId = investment.farmerId;
            investorId = investment.investorId;
            amount = investment.amount;
            interestRate = investment.interestRate;
            startDate = investment.startDate;
            duration = investment.duration;
            status = #Completed;
        };

        investments.put(investmentIndex, updatedInvestment);
        #ok(())
    };
}
