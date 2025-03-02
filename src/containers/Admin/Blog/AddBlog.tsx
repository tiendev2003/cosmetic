import { Editor } from '@tinymce/tinymce-react';
import { FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Blog, BlogCategory, Tag, UserInfo } from "../../../types";

const mockCategories: BlogCategory[] = [
  { id: 1, name: 'Programming', description: 'All about programming', createdDate: '2025-03-01', updatedDate: '2025-03-01' },
  { id: 2, name: 'Web Development', description: 'All about web development', createdDate: '2025-03-01', updatedDate: '2025-03-01' },
  { id: 3, name: 'CSS', description: 'All about CSS', createdDate: '2025-03-01', updatedDate: '2025-03-01' },
  { id: 4, name: 'UI/UX', description: 'All about UI/UX', createdDate: '2025-03-01', updatedDate: '2025-03-01' },
];

const mockAuthors: UserInfo[] = [
  { id: 1, username: 'admin', email: 'admin@gmail.con', avatar: '', role: 'admin', is_blocked: false },
  { id: 2, username: 'admin', email: 'admin@gmail.con', avatar: '', role: 'admin', is_blocked: false },
  { id: 3, username: 'admin', email: 'admin@gmail.con', avatar: '', role: 'admin', is_blocked: false },
  { id: 4, username: 'admin', email: 'admin@gmail.con', avatar: '', role: 'admin', is_blocked: false },
  { id: 5, username: 'admin', email: 'admin@gmail.con', avatar: '', role: 'admin', is_blocked: false },

];

const initialTags: Tag[] = [
  { id: 1, name: 'React' },
  { id: 2, name: 'TypeScript' },
  { id: 3, name: 'Tailwind' },
];

const mockTags: Tag[] = [
  { id: 1, name: 'React' },
  { id: 2, name: 'TypeScript' },
  { id: 3, name: 'Tailwind' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const AddBlog = () => {
  const navigate = useNavigate();

  // State cho form
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    status: 'Draft',
    categoryId: '',
    authorId: '',
    tagIds: [] as number[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>(initialTags); // Danh sách tag động
  const [newTag, setNewTag] = useState(''); // Tag mới từ input

  // Xử lý thay đổi input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi content từ TinyMCE
  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  // Xử lý thay đổi tag (multiple select)
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setFormData((prev) => ({ ...prev, tagIds: selectedOptions }));
  };

  // Xử lý nhập tag mới
  const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  // Thêm tag mới
  const addNewTag = () => {
    if (newTag.trim() && !tags.some(tag => tag.name.toLowerCase() === newTag.toLowerCase())) {
      const newTagObj: Tag = {
        id: Date.now(), // Tạo ID tạm thời (trong thực tế nên dùng UUID hoặc từ backend)
        name: newTag.trim(),
      };
      setTags((prev) => [...prev, newTagObj]);
      setFormData((prev) => ({ ...prev, tagIds: [...prev.tagIds, newTagObj.id] }));
      setNewTag(''); // Reset input
    }
  };

  // Xử lý khi nhấn Enter trong input tag
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewTag();
    }
  };

  // Xử lý upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: file.name }));
      setImagePreview(imageUrl);
    }
  };

  // Xử lý submit form
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newBlog: Blog = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      image: formData.image,
      status: formData.status,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      category: mockCategories.find((cat) => cat.id === Number(formData.categoryId))!,
      author: mockAuthors.find((auth) => auth.id === Number(formData.authorId))!,
      tags: tags.filter((tag) => formData.tagIds.includes(tag.id)),
    };

    console.log('New Blog:', newBlog);
    navigate('/admin/blog');
  };

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Blog</h1>
        <NavLink
          to="/admin/blog"
          className="text-indigo-600 hover:text-indigo-900 flex items-center"
        >
          <span className="mr-2">Back to Blog List</span>
        </NavLink>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Content with TinyMCE */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <Editor
            apiKey='btnhknzsdtdbu8ck8nwda9fxjxrlb2euoccuw6rfr5otxf02'
            value={formData.content}
            onEditorChange={handleEditorChange}
            init={{
              height: 400,
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
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
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {mockCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Author */}
        <div>
          <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">
            Author
          </label>
          <select
            id="authorId"
            name="authorId"
            value={formData.authorId}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select an author</option>
            {mockAuthors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.username}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tagIds" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <select
            id="tagIds"
            name="tagIds"
            multiple
            value={formData.tagIds.map(String)}
            onChange={handleTagChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">Hold Ctrl (or Cmd) to select multiple tags.</p>

          {/* Input để thêm tag mới */}
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={handleNewTagChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter new tag"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={addNewTag}
              className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <NavLink
            to="/admin/blog"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </NavLink>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Save Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog