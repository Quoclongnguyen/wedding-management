using CodeFirst.Data;
using CodeFirst.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;

        // ✅ Constructor duy nhất và đúng
        public PaymentController(IConfiguration config, ApplicationDbContext context)
        {
            _config = config;
            _context = context;
        }

        [HttpGet("get-payment-url")]
        public ActionResult<string> GetPaymentUrl([FromQuery] int invoiceId, [FromQuery] int amount)
        {
            try
            {
                var paymentUrl = CreatePaymentUrl(HttpContext, invoiceId, amount);
                return Ok(paymentUrl);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        // [HttpGet("payment-return-url")]
        //  public IActionResult ReturnPaymentUrl([FromQuery] string vnp_ResponseCode, [FromQuery] string vnp_TxnRef)
        // {
        //   try
        //   {
        //      if (vnp_ResponseCode == "00" && int.TryParse(vnp_TxnRef, out int invoiceId))
        //    {
        //        var invoice = _context.Invoice.FirstOrDefault(i => i.InvoiceID == invoiceId);
        //        if (invoice != null)
        //       {
        // 👉 Chỉ cập nhật thanh toán đặt cọc (50%)
        //          invoice.PaymentWallet = false;
        //          invoice.PaymentStatus = false;
        //         invoice.OrderStatus = "Đã đặt cọc";
        //         invoice.DepositPayment = invoice.Total / 2;
        //         _context.SaveChanges();

        // //      return Redirect($"http://localhost:5173/payment?status=success&invoiceId={invoiceId}");
        // }
        //  }
        //      return Redirect("http://localhost:5173/payment?status=fail");
        //   }
        //   catch
        //  {
        //      return Redirect("http://localhost:5173/payment?status=fail");
        //  }
        //  }



       
        private string CreatePaymentUrl(HttpContext context, int invoiceId, int amount)
        {
            var vnpay = new VnPayLibrary();
            var amountVnpay = (long)Math.Round((decimal)amount * 100);

            // Tạo TxnRef duy nhất cho mỗi lần thanh toán
            var txnRef = $"{invoiceId}-{DateTime.Now:yyyyMMddHHmmssfff}";

            vnpay.AddRequestData("vnp_Version", _config["VnPay:Version"]);
            vnpay.AddRequestData("vnp_Command", _config["VnPay:Command"]);
            vnpay.AddRequestData("vnp_TmnCode", _config["VnPay:TmnCode"]);
            vnpay.AddRequestData("vnp_Amount", amountVnpay.ToString());
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", _config["VnPay:CurrCode"]);
            vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress(context));
            vnpay.AddRequestData("vnp_Locale", _config["VnPay:Locale"]);
            vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toán đơn hàng #{invoiceId}");
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_TxnRef", txnRef); // Sử dụng mã mới
            vnpay.AddRequestData("vnp_ReturnUrl", _config["VnPay:PaymentBackReturnUrl"]);

            var paymentUrl = vnpay.CreateRequestUrl(_config["VnPay:BaseUrl"], _config["VnPay:HashSecret"]);
            return paymentUrl;
        }
        

    }
}
