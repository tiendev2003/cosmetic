import { Menu, Transition } from '@headlessui/react';
import {
    Bars3Icon,
    ChevronDownIcon,
    ChevronRightIcon,
    CubeIcon,
    HomeIcon,
    ListBulletIcon,
    PencilSquareIcon,
    PercentBadgeIcon,
    ShoppingCartIcon,
    TagIcon,
    UserCircleIcon,
    UsersIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';

interface MenuItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    children?: MenuItem[];
}

const generateNavigation = (): MenuItem[] => {
    return [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        {
            name: 'Brands',
            href: '/admin/brand',
            icon: TagIcon,
            children: [
                { name: 'List Brands', href: '/admin/brand', icon: ListBulletIcon },
                { name: 'Add Brand', href: '/admin/brand/add', icon: PencilSquareIcon },
            ],
        },
        {
            name: 'Products',
            href: '/admin/products',
            icon: CubeIcon,
            children: [
                { name: 'List Products', href: '/admin/products', icon: ListBulletIcon },
                { name: 'Add Product', href: '/admin/products/add', icon: PencilSquareIcon },
            ],
        },
        {
            name: 'Categories',
            href: '/admin/categories',
            icon: ListBulletIcon,
            children: [
                { name: 'List Categories', href: '/admin/categories', icon: ListBulletIcon },
                { name: 'Add Category', href: '/admin/categories/add', icon: PencilSquareIcon },
            ],
        },
        {
            name: 'Discounts',
            href: '/admin/discounts',
            icon: PercentBadgeIcon,
            children: [
                { name: 'List Discounts', href: '/admin/discounts', icon: ListBulletIcon },
                { name: 'Add Discount', href: '/admin/discounts/add', icon: PencilSquareIcon },
            ],
        },
        {
            name: 'Orders',
            href: '/admin/orders',
            icon: ShoppingCartIcon,
            children: [
                { name: 'List Orders', href: '/admin/orders', icon: ListBulletIcon },
            ],
        },
        {
            name: 'Blog',
            href: '/admin/blog',
            icon: PencilSquareIcon,
            children: [
                { name: 'List Blogs', href: '/admin/blog', icon: ListBulletIcon },
                { name: 'Add Blog', href: '/admin/blog/add', icon: PencilSquareIcon },
                { name: 'Categories', href: '/admin/blog-categories', icon: ListBulletIcon },
                { name: 'Add Category', href: '/admin/blog-categories/add', icon: PencilSquareIcon },
            ],
        },
        { name: 'Users', href: '/admin/users', icon: UsersIcon },
    ];
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const navigation = generateNavigation();

    const toggleMenuItem = (name: string) => {
        setExpandedItems((prev) =>
            prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
        );
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={classNames(
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                    'fixed inset-y-0 left-0 w-72 bg-gray-900 text-white shadow-lg transition-transform duration-300 flex flex-col z-[999]'
                )}
            >
                <div className="flex items-center justify-between h-16 px-6 bg-gray-800 shrink-0">
                    <span className="text-2xl font-bold">Admin Panel</span>
                    <button onClick={() => setSidebarOpen(false)}>
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto px-2 py-4">
                    {navigation.map((item) => {
                        const isExpanded = expandedItems.includes(item.name);
                        const Icon = item.icon;
                        return (
                            <div key={item.name}>
                                <button
                                    onClick={() => toggleMenuItem(item.name)}
                                    className="flex justify-between items-center w-full px-4 py-3 hover:bg-gray-700"
                                >
                                    <div className="flex items-center">
                                        <Icon className="h-5 w-5 mr-2" />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.children &&
                                        (isExpanded ? (
                                            <ChevronDownIcon className="h-4 w-4" />
                                        ) : (
                                            <ChevronRightIcon className="h-4 w-4" />
                                        ))}
                                </button>
                                {isExpanded && item.children && (
                                    <div className="ml-6">
                                        {item.children.map((child) => (
                                            <NavLink
                                                key={child.name}
                                                to={child.href}
                                                className={({ isActive }) =>
                                                    classNames(
                                                        isActive ? 'bg-gray-800' : '',
                                                        'block px-4 py-2 hover:bg-gray-700 flex items-center'
                                                    )
                                                }
                                            >
                                                <child.icon className="h-5 w-5 mr-2" />
                                                {child.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-md px-6 py-4 flex justify-between">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center space-x-2">
                            <UserCircleIcon className="h-8 w-8 text-gray-500" />
                            <span>Admin</span>
                        </Menu.Button>
                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-in"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md">
                                <Menu.Item>
                                    {({ active }) => (
                                        <NavLink
                                            to="/profile"
                                            className={classNames(
                                                active ? 'bg-gray-100' : '',
                                                'block px-4 py-2 text-gray-700'
                                            )}
                                        >
                                            Profile
                                        </NavLink>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <NavLink
                                            to="/logout"
                                            className={classNames(
                                                active ? 'bg-gray-100' : '',
                                                'block px-4 py-2 text-gray-700'
                                            )}
                                        >
                                            Logout
                                        </NavLink>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}