using classroomrentauth.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Dto;
using webapi.Models;
using Microsoft.AspNetCore.Authorization;
using classroomrentauth.Models;
using Microsoft.AspNetCore.Identity;
using classroomrentauth.Dto;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using Humanizer.Localisation;
using System.Data;

namespace webapi.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class UtentiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UtentiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Utenti
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UtenteDto>>?> GetUtenti()
        {
            if (_context.ApplicationUser == null || _context.IdentityRoles == null)
            {
                return NotFound();
            }

            var list = await _context.ApplicationUser.ToListAsync();

            if(list != null)
            {
                List<UtenteDto> results = new();

                foreach (ApplicationUser a in list)
                {
                    var roles = await _context.IdentityRoles.FromSqlRaw("SELECT r.* FROM AspNetRoles r JOIN AspNetUserRoles ru ON r.Id = ru.RoleId" +
                        "  WHERE ru.UserId = {0}", a.Id).ToListAsync();
                    Console.WriteLine(roles);
                    results.Add(new UtenteDto(a, roles));
                }

                return results;
            }
            return null;
        }

        // GET: api/Utenti/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UtenteDto>> GetUtente(string id)
        {

            if (_context.ApplicationUser == null || _context.IdentityRoles == null)
            {
                return NotFound();
            }

            var utente = await _context.ApplicationUser.FindAsync(id);

            if (utente != null)
            {
                var roles = await _context.IdentityRoles.FromSqlRaw("SELECT r.* FROM AspNetRoles r JOIN AspNetUserRoles ru ON r.Id = ru.RoleId" +
                        "  WHERE ru.UserId = {0}", utente.Id).ToListAsync();

                UtenteDto results =  new(utente, roles);

                return results;
            } else
            {
                return NotFound();
            }
        }

        // PUT: api/Utente/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUtente(string id, UtenteDto utenteDto)
        {

            if (_context.Database == null || _context.IdentityRoles == null)
            {
                return NotFound();
            }
            if (id != utenteDto.Id)
            {
                return BadRequest();
            }
            if(utenteDto.Ruoli != null)
            {
                if (utenteDto.Ruoli.Contains("Admin"))
                {
                    return NoContent();
                }
                if (utenteDto.Ruoli.Contains("Responsabile"))
                {
                    var role = await _context.IdentityRoles.FromSqlRaw("SELECT * FROM AspNetRoles " +
                    "  WHERE Name = {0}", "Responsabile").FirstAsync();

                    var sql = "INSERT INTO AspNetUserRoles (UserId, RoleId) VALUES ({0}, {1})";
                    var result = await _context.Database.ExecuteSqlRawAsync(sql, utenteDto.Id, role.Id);

                    if (result > 0)
                    {
                        return Ok();
                    } else
                    {
                        return NotFound();
                    }
                } 
                else
                {
                    var result = await _context.Database.ExecuteSqlRawAsync(
                        "DELETE FROM AspNetUserRoles WHERE UserId = {0} " +
                        "AND RoleId IN (SELECT Id FROM AspNetRoles WHERE Name = 'Responsabile')", utenteDto.Id);
                    if (result > 0)
                    {
                        return Ok();
                    }
                    else
                    {
                        return NotFound();
                    }
                }
            }
            return NoContent();
        }

        // DELETE: api/Utente/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUtente(string id)
        {
            if (_context.ApplicationUser == null)
            {
                return NotFound();
            }
            var utente = await _context.ApplicationUser.FindAsync(id);
            if (utente == null)
            {
                return NotFound();
            }

            var roles = await _context.IdentityRoles.FromSqlRaw("SELECT r.* FROM AspNetRoles r JOIN AspNetUserRoles ru ON r.Id = ru.RoleId" +
                    "  WHERE ru.UserId = {0}", utente.Id).ToListAsync();

            foreach (var role in roles)
            {
                if(role.Name == "Admin")
                {
                    return BadRequest();
                }
            }

            _context.ApplicationUser.Remove(utente);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool ApplicationUserExists(string id)
        {
            return (_context.ApplicationUser?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
