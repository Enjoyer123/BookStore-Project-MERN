import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { fetchDataFromApi } from '../../../utils/api';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

const LineChartWithDateLabels = () => {
  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); 
  const currentYear = currentDate.getFullYear();


  const [salesData, setSalesData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    
    fetchDataFromApi('/api/orders/daily-sales').then((res) => {
      setSalesData(res.data);
     
      const years = [...new Set(res.data.map(item => item.date.split('-')[0]))];
      setAvailableYears(years);
      // console.log(availableYears);
    });
  }, []);


  const filterDataByMonthAndYear = (year, month) => {
    return salesData.filter(item => item.date.startsWith(`${year}-${month}`));
  };

  
  const createDateLabels = (daysInMonth) => {
    const labels = [];
    for (let i = 1; i <= daysInMonth; i += 1) { 
      labels.push(i);
    }
    return labels;
  };

 
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  
  const filteredData = filterDataByMonthAndYear(selectedYear, selectedMonth);
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const labels = createDateLabels(daysInMonth);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total Sales',
        data: labels.map(day => {
          const sale = filteredData.find(item => new Date(item.date).getDate() === day);
          return sale ? sale.totalSales : 0; 
        }),
        borderColor: '#FD06B6',
        backgroundColor: '#FF69B4',
        fill: true,
        tension: 0.4
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
      },
    },
  };

  const availableMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  return (
    <div className='chart-container'>
      <div className='card-body '>

      <div className='d-flex justify-content-between align-items-center mb-3'>
          <h4 className='card-title'>Sales</h4>
          <div className='ml-auto'>

            <FormControl size="small">
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                className='me-2'
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel id="month-select-label">Month</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
               
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {availableMonths.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

        </div>

        <Line data={data} options={options} />


      </div>
    </div>

  );
};

export default LineChartWithDateLabels;
