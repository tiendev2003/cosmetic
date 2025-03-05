import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Cell, Pie, PieChart } from "recharts"
import OrdersChart from '../../../components/OrdersChart'
import RevenueChart from '../../../components/RevenueChart'
import SummaryCards from '../../../components/SummaryCards'
import { fetchOrderStatusCounts, fetchReports } from '../../../features/report/reportSlice'
import { AppDispatch, RootState } from '../../../store'

const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx: number,
  cy: number,
  midAngle: number,
  innerRadius: number,
  outerRadius: number,
  percent: number,
  index: number
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const DashboardPage = () => {
  const dispatch: AppDispatch = useDispatch()
  const { reports, orderStatusCounts } = useSelector((state: RootState) => state.report)
  // Extract available years from data
  useEffect(() => {
    dispatch(fetchReports(
      new Date().getFullYear()
    ))
  }, [dispatch])
  useEffect(() => {
    dispatch(fetchOrderStatusCounts())
  }, [dispatch])


  // Default to the most recent year
  const [selectedYear, setSelectedYear] = useState(
    availableYears.length > 0 ? availableYears[0] : new Date().getFullYear(),
  )

  // Filter data for the selected year and ensure all 12 months are represented
  const processedData = useMemo(() => {
    const filteredData = reports.filter((item) => item.year === selectedYear)

    // Create an array with all 12 months
    const allMonthsData = Array.from({ length: 12 }, (_, i) => {
      // Find data for this month if it exists
      const monthData = filteredData.find((item) => item.month === i + 1)

      // Return existing data or create empty data for the month
      return (
        monthData || {
          month: i + 1,
          year: selectedYear,
          totalRevenue: 0,
          totalDiscountedRevenue: 0,
          totalOrders: 0,
        }
      )
    })

    return allMonthsData
  }, [reports, selectedYear])

  // Calculate summary metrics for the selected year
  const yearSummary = useMemo(() => {
    return processedData.reduce(
      (acc, curr) => {
        return {
          totalRevenue: acc.totalRevenue + curr.totalRevenue,
          totalDiscountedRevenue: acc.totalDiscountedRevenue + curr.totalDiscountedRevenue,
          totalOrders: acc.totalOrders + curr.totalOrders,
        }
      },
      { totalRevenue: 0, totalDiscountedRevenue: 0, totalOrders: 0 },
    )
  }, [processedData])

  // Prepare data for the pie chart


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Thống kê</h1>

        <div className="w-full sm:w-64">
          <Listbox value={selectedYear} onChange={setSelectedYear}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm">
                <span className="block truncate">Năm: {selectedYear}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                  {availableYears.map((year) => (
                    <Listbox.Option
                      key={year}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                        }`
                      }
                      value={year}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{year}</span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      <SummaryCards summary={yearSummary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Xu hướng doanh thu</h2>
          <RevenueChart data={processedData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Đơn hàng hàng tháng</h2>
          <OrdersChart data={processedData} />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Tình trạng đơn hàng</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <PieChart width={400} height={400}>
            <Pie
              data={orderStatusCounts}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="orderCount"
            >
              {orderStatusCounts.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>

      </div>
    </div>
  )
}

export default DashboardPage