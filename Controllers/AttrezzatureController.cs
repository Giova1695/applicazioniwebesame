using classroomrentauth.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Dto;
using webapi.Models;
using Microsoft.AspNetCore.Authorization;


namespace webapi.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AttrezzatureController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttrezzatureController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Attrezzature
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AttrezzaturaDto>>?> GetAttrezzatura()
        {
            if (_context.Attrezzatura == null)
            {
                return NotFound();
            }

            return await getAttrezzatureDtoList();
        }

        private async Task<ActionResult<IEnumerable<AttrezzaturaDto>>?> getAttrezzatureDtoList()
        {
            var list = await getAttrezzature();

            if(list != null)
            {
                if(list.Value != null)
                {
                    List<AttrezzaturaDto> results = new List<AttrezzaturaDto>();

                    foreach (Attrezzatura a in list.Value)
                    {
                        results.Add(new AttrezzaturaDto(a));
                    }

                    return results;
                } 
                else
                {
                    return null;
                }
            }
            return null;
        }

        private async Task<ActionResult<IEnumerable<Attrezzatura>>> getAttrezzature()
        {
            if (_context.Attrezzatura == null)
            {
                return NotFound();
            }

            return await _context.Attrezzatura.ToListAsync();
        }

        // GET: api/Attrezzature/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AttrezzaturaDto>> GetAttrezzatura(int id)
        {
          if (_context.Attrezzatura == null)
          {
              return NotFound();
          }
            var attrezzatura = await _context.Attrezzatura.FindAsync(id);

            if (attrezzatura == null)
            {
                return NotFound();
            }

            return new AttrezzaturaDto(attrezzatura);
        }

        // PUT: api/Attrezzature/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttrezzatura(int id, AttrezzaturaDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            Attrezzatura? attrezzatura = Attrezzatura.GetFromDto(dto);

            if(attrezzatura != null)
            {
                _context.Entry(attrezzatura).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AttrezzaturaExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }           

            return NoContent();
        }

        // POST: api/Attrezzature
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Attrezzatura>> PostAttrezzatura(AttrezzaturaDto dto)
        {
          if (_context.Attrezzatura == null)
          {
              return Problem("Entity set 'AulaRentContext.Attrezzatura'  is null.");
          }

          Attrezzatura? attrezzatura = Attrezzatura.GetFromDto(dto);

          if(attrezzatura != null)
          {
                _context.Attrezzatura.Add(attrezzatura);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAttrezzatura), new { id = attrezzatura.Id }, attrezzatura);
          }
          
          return Problem("Errore nel salvataggio dell'attrezzatura");
        }

        // DELETE: api/Attrezzature/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttrezzatura(int id)
        {
            if (_context.Attrezzatura == null)
            {
                return NotFound();
            }
            var attrezzatura = await _context.Attrezzatura.FindAsync(id);
            if (attrezzatura == null)
            {
                return NotFound();
            }

            _context.Attrezzatura.Remove(attrezzatura);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AttrezzaturaExists(int id)
        {
            return (_context.Attrezzatura?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
