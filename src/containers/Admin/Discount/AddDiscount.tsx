import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router';
import { addDiscount, fetchDiscountById, updateDiscount } from '../../../features/discount/discountSlice';
import { AppDispatch, RootState } from '../../../store';
import { Discount, DiscountType } from '../../../types/discount.types';

const AddDiscount = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { discount, loading, error } = useSelector((state: RootState) => state.discounts);

  // State cho form
  const [formData, setFormData] = useState({
    name: '',
    discountCode: '',
    discountType: DiscountType.PERCENTAGE,
    discountValue: 0,
    minOrderValue: 0,
    maxDiscountAmount: 0,
    maxUsage: 0,
    startDate: '',
    endDate: '',
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchDiscountById(Number(id))).then((action) => {
        if (fetchDiscountById.fulfilled.match(action)) {
          const discount = action.payload;
          setFormData({
            name: discount.name,
            discountCode: discount.discountCode,
            discountType: discount.discountType,
            discountValue: discount.discountValue,
            minOrderValue: discount.minOrderValue,
            maxDiscountAmount: discount.maxDiscountAmount,
            maxUsage: discount.maxUsage,
            startDate:  discount.startDate.toLocaleString().split('T')[0],
            endDate: discount.endDate. toLocaleString().split('T')[0],
            isActive: discount.isActive,
          });
        }
      });
    }
  }, [id, dispatch]);

  // Xử lý thay đổi input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Tạo object Discount theo model
    const newDiscount: Discount = {
      id: discount ? discount.id : Date.now(), // Tạm dùng timestamp làm ID, thay bằng ID từ backend trong thực tế
      name: formData.name,
      discountCode: formData.discountCode,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      minOrderValue: formData.minOrderValue,
      maxDiscountAmount: formData.maxDiscountAmount,
      maxUsage: formData.maxUsage,
      usageCount: discount ? discount.usageCount : 0,
      applicableProductId: discount ? discount.applicableProductId : 0, // Cần cập nhật theo yêu cầu thực tế
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      isActive: formData.isActive,
    };

    try {
      if (discount?.id) {
        await dispatch(updateDiscount(newDiscount)).unwrap();
        toast.success('Discount updated successfully');
      } else {
        await dispatch(addDiscount(newDiscount)).unwrap();
        toast.success('Discount added successfully');
      }
      navigate('/admin/discounts');
    } catch (error) {
      console.log('Failed to save discount:', error);
      toast.error('Failed to save discount');
    }
  };

  return (
    <div className="p-6   mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thêm giảm giá mới</h1>
        <NavLink
          to="/admin/discount"
          className="text-indigo-600 hover:text-indigo-900 flex items-center"
        >
          <span className="mr-2">Back to Discount List</span>
        </NavLink>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Discount Code */}
          <div>
            <label htmlFor="discountCode" className="block text-sm font-medium text-gray-700">
              Mã giảm giá
            </label>
            <input
              type="text"
              id="discountCode"
              name="discountCode"
              value={formData.discountCode}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Discount Type */}
          <div>
            <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
              Loại giảm giá
            </label>
            <select
              id="discountType"
              name="discountType"
              value={formData.discountType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value={DiscountType.PERCENTAGE}>Phần trăm</option>
              <option value={DiscountType.FIXED_AMOUNT}>Số tiền cố định</option>
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
              Giá trị giảm giá
            </label>
            <input
              type="number"
              id="discountValue"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Min Order Value */}
          <div>
            <label htmlFor="minOrderValue" className="block text-sm font-medium text-gray-700">
              Giá trị đơn hàng tối thiểu
            </label>
            <input
              type="number"
              id="minOrderValue"
              name="minOrderValue"
              value={formData.minOrderValue}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Max Discount Amount */}
          <div>
            <label htmlFor="maxDiscountAmount" className="block text-sm font-medium text-gray-700">
              Số tiền giảm giá tối đa
            </label>
            <input
              type="number"
              id="maxDiscountAmount"
              name="maxDiscountAmount"
              value={formData.maxDiscountAmount}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Max Usage */}
          <div>
            <label htmlFor="maxUsage" className="block text-sm font-medium text-gray-700">
              Số lần sử dụng tối đa
            </label>
            <input
              type="number"
              id="maxUsage"
              name="maxUsage"
              value={formData.maxUsage}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Ngày kết thúc
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Is Active */}
          <div>
            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              id="isActive"
              name="isActive"
              value={formData.isActive ? 'true' : 'false'}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="true">Hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <NavLink
            to="/admin/discount"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </NavLink>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Lưu giảm giá
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDiscount;