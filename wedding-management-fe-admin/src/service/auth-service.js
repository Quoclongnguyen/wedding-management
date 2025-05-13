import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Hàm logout
/*
const logout = () => {
    try {
        // Xóa token và roles khỏi localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("roles");

        // Xóa header Authorization
        delete axios.defaults.headers.common["Authorization"];

        // Chuyển hướng về trang login
        window.location.href = "/#/login";
    } catch (error) {
        console.error("Lỗi khi logout:", error);
    }
};
*/

const logout = (router) => {
    try {
        // Xóa token và roles khỏi localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("roles");

        // Xóa header Authorization
        delete axios.defaults.headers.common["Authorization"];

        // Chuyển hướng về trang login bằng Vue Router
        router.push('/login');
    } catch (error) {
        console.error("Lỗi khi logout:", error);
    }
};
// Hàm kiểm tra quyền của người dùng
const checkRoleUser = () => {
    try {
        const token = localStorage.getItem("token");
        const roles = JSON.parse(localStorage.getItem("roles") || "[]");

        if (!token || roles.length === 0) {
            console.warn("Token hoặc roles không tồn tại.");
            return false;
        }

         const decodedToken = jwtDecode(token);


        // Kiểm tra token hết hạn
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            console.warn("Token đã hết hạn.");
            logout();
            return false;
        }

        // Danh sách các role được phép
        const allowedRoles = ["employee", "administrator system", "admin"];
        const hasValidRole = roles.some((role) => allowedRoles.includes(role));

        if (!hasValidRole) {
            console.warn("Người dùng không có quyền hợp lệ.");
            logout();
            return false;
        }

        return true;
    } catch (error) {
        console.error("Lỗi khi kiểm tra quyền người dùng:", error);
        return false;
    }
};

// Hàm lấy thông tin người dùng hiện tại
const getCurrentUser = () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("Token không tồn tại.");
            return null;
        }

        const decodedToken = jwt(token);

        // Kiểm tra token hết hạn
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            console.warn("Token đã hết hạn.");
            logout();
            return null;
        }

        return decodedToken;
    } catch (error) {+
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        return null;
    }
};

// Export các hàm trong authService
const authService = {
    logout,
    checkRoleUser,
    getCurrentUser,
};

export default authService;