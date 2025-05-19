<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">Nhà Hàng Tiệc Cưới VIP</h3>
          <p class="footer-description">
            Nơi tạo nên những kỷ niệm đẹp và trọn vẹn cho ngày trọng đại của bạn.
            Với không gian sang trọng và dịch vụ chuyên nghiệp, chúng tôi cam kết
            mang đến trải nghiệm hoàn hảo nhất.
          </p>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">Liên Hệ</h3>
          <ul class="footer-contact">
            <li>
              <i class="icon fa fa-phone"></i>
              <span>Hotline: 1900 xxxx</span>
            </li>
            <li>
              <i class="icon fa fa-envelope"></i>
              <span>Email: contact@wedding.com</span>
            </li>
            <li>
              <i class="icon fa fa-map-marker-alt"></i>
              <span>Địa chỉ: TP.HCM</span>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">Dịch Vụ</h3>
          <ul class="footer-links">
            <li><router-link to="/listhall">Sảnh Cưới</router-link></li>
            <li><router-link to="/listmenu">Thực Đơn</router-link></li>
            <li><router-link to="/listservice">Dịch Vụ Cưới</router-link></li>
            <li><router-link to="/listbranch">Chi Nhánh</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">Theo Dõi</h3>
          <div class="social-links">
            <a href="#" class="social-link">
              <i class="icon fa fa-facebook"></i>
            </a>
            <a href="#" class="social-link">
              <i class="icon fa fa-twitter"></i>
            </a>
            <a href="#" class="social-link">
              <i class="icon fa fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="copyright">
          © 2024 Nhà Hàng Tiệc Cưới VIP.
        </div>
        <div class="footer-bottom-links">
          <a href="#">Điều khoản sử dụng</a>
          <a href="#">Chính sách bảo mật</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import "./Footer.scss"
export default {
  name: 'Footer',
}

</script>

<style scoped>
/* Thêm style tương tự như trong Footer.scss */
</style>