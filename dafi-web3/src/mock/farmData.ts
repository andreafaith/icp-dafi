export const mockFarmData = {
  farms: [
    {
      id: 'farm1',
      name: 'Green Valley Farm',
      location: 'California, USA',
      size: '250 acres',
      crops: [
        {
          name: 'Organic Corn',
          area: '100 acres',
          status: 'Growing',
          plantedDate: '2024-10-01',
          expectedHarvest: '2024-12-30',
          health: 92,
          irrigation: {
            status: 'Optimal',
            nextSchedule: '2024-12-19',
            waterUsage: '2500 gallons/day'
          }
        },
        {
          name: 'Soybeans',
          area: '75 acres',
          status: 'Ready for Harvest',
          plantedDate: '2024-09-15',
          expectedHarvest: '2024-12-20',
          health: 95,
          irrigation: {
            status: 'Optimal',
            nextSchedule: '2024-12-19',
            waterUsage: '2000 gallons/day'
          }
        },
        {
          name: 'Wheat',
          area: '75 acres',
          status: 'Growing',
          plantedDate: '2024-11-01',
          expectedHarvest: '2025-01-15',
          health: 88,
          irrigation: {
            status: 'Needs Adjustment',
            nextSchedule: '2024-12-19',
            waterUsage: '1800 gallons/day'
          }
        }
      ],
      soil: {
        type: 'Loamy',
        ph: 6.8,
        organic: '4.2%',
        moisture: '38%',
        lastTested: '2024-12-15'
      },
      equipment: [
        {
          name: 'Tractor',
          model: 'John Deere 8R 410',
          status: 'Operational',
          lastMaintenance: '2024-11-30',
          nextMaintenance: '2024-12-30'
        },
        {
          name: 'Harvester',
          model: 'Case IH 8250',
          status: 'Under Maintenance',
          lastMaintenance: '2024-12-15',
          nextMaintenance: '2024-12-25'
        }
      ]
    },
    {
      id: 'farm2',
      name: 'Sunrise Agriculture',
      location: 'Iowa, USA',
      size: '180 acres',
      crops: [
        {
          name: 'Premium Corn',
          area: '80 acres',
          status: 'Growing',
          plantedDate: '2024-10-15',
          expectedHarvest: '2025-01-15',
          health: 90,
          irrigation: {
            status: 'Optimal',
            nextSchedule: '2024-12-19',
            waterUsage: '2200 gallons/day'
          }
        },
        {
          name: 'Organic Soybeans',
          area: '100 acres',
          status: 'Growing',
          plantedDate: '2024-10-01',
          expectedHarvest: '2024-12-25',
          health: 94,
          irrigation: {
            status: 'Optimal',
            nextSchedule: '2024-12-19',
            waterUsage: '2300 gallons/day'
          }
        }
      ],
      soil: {
        type: 'Clay Loam',
        ph: 7.0,
        organic: '3.8%',
        moisture: '42%',
        lastTested: '2024-12-16'
      },
      equipment: [
        {
          name: 'Tractor',
          model: 'John Deere 7R 330',
          status: 'Operational',
          lastMaintenance: '2024-12-01',
          nextMaintenance: '2024-12-31'
        },
        {
          name: 'Irrigation System',
          model: 'Valley 8000',
          status: 'Operational',
          lastMaintenance: '2024-12-10',
          nextMaintenance: '2025-01-10'
        }
      ]
    },
    {
      id: 'farm3',
      name: 'Highland Organic Farm',
      location: 'Montana, USA',
      size: '150 acres',
      crops: [
        {
          name: 'Organic Wheat',
          area: '100 acres',
          status: 'Growing',
          plantedDate: '2024-11-01',
          expectedHarvest: '2025-01-30',
          health: 91,
          irrigation: {
            status: 'Optimal',
            nextSchedule: '2024-12-19',
            waterUsage: '2100 gallons/day'
          }
        },
        {
          name: 'Barley',
          area: '50 acres',
          status: 'Growing',
          plantedDate: '2024-11-15',
          expectedHarvest: '2025-02-15',
          health: 89,
          irrigation: {
            status: 'Needs Adjustment',
            nextSchedule: '2024-12-19',
            waterUsage: '1500 gallons/day'
          }
        }
      ],
      soil: {
        type: 'Sandy Loam',
        ph: 6.5,
        organic: '3.5%',
        moisture: '35%',
        lastTested: '2024-12-17'
      },
      equipment: [
        {
          name: 'Tractor',
          model: 'Case IH Magnum 400',
          status: 'Operational',
          lastMaintenance: '2024-12-05',
          nextMaintenance: '2025-01-05'
        },
        {
          name: 'Seeder',
          model: 'Bourgault 3320',
          status: 'Operational',
          lastMaintenance: '2024-12-01',
          nextMaintenance: '2024-12-31'
        }
      ]
    }
  ]
};
