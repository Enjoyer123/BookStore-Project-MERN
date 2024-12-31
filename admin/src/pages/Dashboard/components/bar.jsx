
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; 
import Chart from 'chart.js/auto';
import { fetchDataFromApi } from '../../../utils/api';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const BarChartWithYearSelection = () => {

  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
  const currentYear = currentDate.getFullYear();

  const [monthlySale, setMonthlySale] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetchDataFromApi(`/api/orders/all-monthly-sales`).then((res) => {
      setMonthlySale(res);

     
      const uniqueYears = Array.from(new Set(res.map(item => item.month.split('-')[0])));
      setYears(uniqueYears);
    });
  }, []);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const labels = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return `${selectedYear}-${month}`; 
  });

  const data = {
    labels: monthNames,
    datasets: [
      {
        label: 'Monthly Sales',
        data: labels.map((label) => {
        
          const saleData = monthlySale.find(sale => sale.month === label);
          return saleData ? saleData.totalSales : 0; 
        }),
        backgroundColor: '#FF69B4',
        borderColor: '#FF69B4', 
        borderWidth: 2, 
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      
      legend: {
        display: false,
        position: 'top', 
      },
      title: {
        display: false,


      },
    },
    scales: {
      x: {

        grid: {
          display: false, 
        },
      },
      y: {
        min: 0, 
        max: Math.max(...monthlySale.map(sale => sale.totalSales)) + 100, 
        grid: {
          display: true, 
        },
      },
    },
  };

  return (
    <>
      <div className='chart-container'>
        <div className='card-body'>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h4 className='card-title ml-auto'>Month Sales</h4>

            <FormControl size="small">
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Bar data={data} options={options} />
        </div>
      </div>




    </>
  );
};

export default BarChartWithYearSelection;
