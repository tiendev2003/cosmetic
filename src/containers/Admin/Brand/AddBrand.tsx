import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router';
import api from '../../../api/api';
import { addBrand, fetchBrandById, updateBrand } from '../../../features/brand/brandSlice';
import { AppDispatch, RootState } from '../../../store';
import { Brand } from '../../../types';
import { uploadImage } from '../../../utils/uploadImage';

const AddBrand = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { brand } = useSelector((state: RootState) =>
    state.brands
  );
  console.log('fetchBrandById',id);


  // State cho form
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    image: File | string | null;
    status: string;
  }>({
    name: '',
    description: '',
    image: null,
    status: 'Active',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load brand cần chỉnh sửa nếu có
  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        description: brand.description,
        image: brand.image ,
        status: brand.status,
      });
      setImagePreview(brand.image);
    }
  }, [ ]);

  useEffect(() => {
    if (id) {
      dispatch(fetchBrandById(id)).then((action) => {
        if (fetchBrandById.fulfilled.match(action)) {
          const brand = action.payload;
          setFormData({
            name: brand.name,
            description: brand.description,
            image: brand.image,
            status: brand.status,
          });
          setImagePreview(brand.image);
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

  // Xử lý upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(imageUrl);
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = imagePreview;
      if (formData.image) {
        const formDataImage = new FormData();
        formDataImage.append('file', formData.image as File);
        const image = await uploadImage(formDataImage);
        imageUrl = api.getUri() + "/api" + image;
      }

      const newBrand: Brand = {
        id: brand ? brand.id : Date.now(),
        name: formData.name,
        description: formData.description,
        image: imageUrl!,
        status: formData.status,
        createdDate: brand ? brand.createdDate : new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      if (brand) {
        await dispatch(updateBrand(newBrand)).unwrap();
        toast.success('Cập nhật thương hiệu thành công');
      } else {
        await dispatch(addBrand(newBrand)).unwrap();
        toast.success('Thêm thương hiệu thành công');
      }

      navigate('/admin/brand');
    } catch (error) {
      console.log('Failed to save brand:', error);
      toast.error('Có lỗi xảy ra khi lưu thương hiệu');
    }
  };

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {brand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
        </h1>
        <NavLink
          to="/admin/brand"
          className="text-indigo-600 hover:text-indigo-900 flex items-center"
        >
          <span className="mr-2">Quay lại danh sách thương hiệu</span>
        </NavLink>
      </div>
    
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
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

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Hình ảnh
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="h-40 w-auto rounded-md" />
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Trạng thái
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="Active">Hoạt động</option>
            <option value="Inactive">Không hoạt động</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <NavLink
            to="/admin/brand"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Hủy
          </NavLink>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            {brand ? 'Cập nhật thương hiệu' : 'Lưu thương hiệu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrand;