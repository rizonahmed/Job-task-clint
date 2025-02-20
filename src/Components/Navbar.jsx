import { useState, useEffect } from "react";
import { BsSun, BsMoon, BsListTask, BsGrid } from "react-icons/bs";
import useAuth from "../Hooks/useAuth";

const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  const handleLogOut = async () => {
    try {
      await signOutUser();
      window.location.href = "/login";
      toast.success("Logout Successful");
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(user);
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md shadow-md bg-gray-300 border-b mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <img className="h-8 w-8  "  src="https://static.vecteezy.com/system/resources/previews/015/280/523/non_2x/job-logo-icon-with-tie-image-free-vector.jpg" alt="" />
            <span className="text-2xl font-bold bg- text-indigo-600 bg-clip-text font-mono">
              JobTask
            </span>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center gap-4">
           

            {/* Profile Button */}
            <button className="flex items-center gap-2 p-1.5 rounded-full  text-white">
              <img
                src={
                  user
                    ? user?.photoURL
                    : "https://avatars.dicebear.com/api/avataaars/anonymous.svg"
                }
                alt="Profile"
                className="w-12 h-12 rounded-full bg-white"
              />
            </button>
            {user && (
              <button
                onClick={handleLogOut}
                className="text-red-500 font-bold bg-white  px-5 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
