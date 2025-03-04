import { CurrencyDollarIcon, ShoppingCartIcon, TrendingDownIcon } from "./Icons"

interface SummaryProps {
  summary: {
    totalRevenue: number
    totalDiscountedRevenue: number
    totalOrders: number
  }
}

const SummaryCards = ({ summary }: SummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const discountAmount = summary.totalRevenue - summary.totalDiscountedRevenue
  const discountPercentage = summary.totalRevenue > 0 ? ((discountAmount / summary.totalRevenue) * 100).toFixed(1) : "0"

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <CurrencyDollarIcon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <TrendingDownIcon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Discounts</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(discountAmount)} <span className="text-sm text-gray-500">({discountPercentage}%)</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <ShoppingCartIcon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-900">{summary.totalOrders.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCards

