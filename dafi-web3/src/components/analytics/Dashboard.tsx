import React, { useEffect } from 'react';
import {
    LineChart,
    BarChart,
    DonutChart,
    Card,
    Title
} from '@tremor/react';

const Dashboard = () => {
    useEffect(() => {
        // Add any initialization logic here
    }, []);

    const chartdata = [
        {
            date: "Jan 22",
            Investments: 2890,
            Farmers: 2338
        },
        {
            date: "Feb 22",
            Investments: 2756,
            Farmers: 2103
        },
        {
            date: "Mar 22",
            Investments: 3322,
            Farmers: 2194
        },
        {
            date: "Apr 22",
            Investments: 3470,
            Farmers: 2108
        },
        {
            date: "May 22",
            Investments: 3475,
            Farmers: 1812
        },
        {
            date: "Jun 22",
            Investments: 3129,
            Farmers: 1726
        },
    ];

    const investmentData = [
        {
            name: "Corn",
            amount: 2488,
        },
        {
            name: "Rice",
            amount: 1445,
        },
        {
            name: "Wheat",
            amount: 743,
        },
    ];

    const pieChartData = [
        {
            name: "Active",
            value: 65,
        },
        {
            name: "Pending",
            value: 20,
        },
        {
            name: "Completed",
            value: 15,
        },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <Title>Investment Trends</Title>
                <LineChart
                    data={chartdata}
                    index="date"
                    categories={["Investments", "Farmers"]}
                    colors={["blue", "green"]}
                    valueFormatter={(number) => `$${number.toLocaleString()}`}
                    yAxisWidth={60}
                />
            </Card>

            <div className="grid grid-cols-2 gap-6">
                <Card>
                    <Title>Investment by Crop</Title>
                    <BarChart
                        data={investmentData}
                        index="name"
                        categories={["amount"]}
                        colors={["blue"]}
                        valueFormatter={(number) => `$${number.toLocaleString()}`}
                        yAxisWidth={48}
                    />
                </Card>

                <Card>
                    <Title>Investment Status</Title>
                    <DonutChart
                        data={pieChartData}
                        index="name"
                        category="value"
                        colors={["green", "yellow", "blue"]}
                    />
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
