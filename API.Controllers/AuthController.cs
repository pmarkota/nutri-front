using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("google/check-email")]
        public async Task<IActionResult> CheckGoogleEmail([FromBody] CheckEmailRequest request)
        {
            try
            {
                var userExists = await _userService.CheckUserExistsByEmailAsync(request.Email);
                // Always return Ok (200) with the exists flag
                return Ok(new { exists = userExists });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error checking email", error = ex.Message });
            }
        }
    }
}
