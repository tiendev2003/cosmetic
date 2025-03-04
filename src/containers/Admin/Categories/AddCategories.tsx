import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router';
import api from '../../../api/api';
import { addCategory, fetchCategoryById, updateCategory } from '../../../features/category/categorySlice';
import { AppDispatch, RootState } from '../../../store';
import { Category } from '../../../types';
import { uploadImage } from '../../../utils/uploadImage';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const AddCategories = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { category, loading, error } = useSelector((state: RootState) => state.categories);

  // State cho form
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | string | null,
    status: 'Active',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryById(Number(id))).then((action) => {
        if (fetchCategoryById.fulfilled.match(action)) {
          const category = action.payload;
           setFormData({
            name: category.name,
            description: category.description,
            image: category.image,
            status: category.status,
          });
          setImagePreview(category.image);
        }
      });
    }
  }, [id, dispatch]);

  // Xử lý submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = imagePreview;
      if (formData.image && typeof formData.image !== 'string') {
        const formDataImage = new FormData();
        formDataImage.append('file', formData.image);
        const image = await uploadImage(formDataImage);
        imageUrl = api.getUri() + "/api" + image;
      }

      const newCategory: Category = {
        id: category ? category.id : Date.now(),
        name: formData.name,
        description: formData.description,
        image: imageUrl!,
        status: formData.status,
        createdDate: category ? category.createdDate : new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };
      console.log('newCategory:', category);
      if (category?.id) {
        await dispatch(updateCategory(newCategory)).unwrap();
        toast.success('Cập nhật danh mục thành công');
      } else {
        await dispatch(addCategory(newCategory)).unwrap();
        toast.success('Thêm danh mục thành công');
      }
      navigate('/admin/categories');
    } catch (error) {
      console.log('Failed to save category:', error);
      toast.error('Có lỗi xảy ra khi lưu danh mục');
    }
  };

  return (
    <div className="p-6  mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{
          category ? `Chỉnh danh mục: ${category.name}` : 'Thêm danh mục'
        }</h1>
        <NavLink
          to="/admin/categories"
          className="text-indigo-600 hover:text-indigo-900 flex items-center"
        >
          <span className="mr-2">Back to Category List</span>
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
            Ảnh
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
            to="/admin/categories"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </NavLink>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Lưu danh mục
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategories;