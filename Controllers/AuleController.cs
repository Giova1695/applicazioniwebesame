using classroomrentauth.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Dto;
using webapi.Models;
using Microsoft.AspNetCore.Authorization;


namespace webapi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuleController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Aule
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AulaDto>>?> GetAula()
        {
            return await GetAulaDtoList();
        }

        private async Task<ActionResult<IEnumerable<AulaDto>>?> GetAulaDtoList()
        {
            var list = await GetAule();

            if (list != null)
            {
                if (list.Value != null)
                {
                    List<AulaDto> results = new List<AulaDto>();

                    foreach (Aula a in list.Value)
                    {
                        results.Add(new AulaDto(a));
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

        private async Task<ActionResult<IEnumerable<Aula>>> GetAule()
        {
            if (_context.Aula == null)
            {
                return NotFound();
            }

            return await _context.Aula.Include(p => p.AulaAttrezzatura!)
                .ThenInclude(p => p.Aula).Select(p => new Aula
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    CapienzaMin = p.CapienzaMin,
                    CapienzaMax = p.CapienzaMax,
                    AulaAttrezzatura = p.AulaAttrezzatura!.Select(a => new AulaAttrezzatura
                    {
                        Id = a.Id,
                        Attrezzatura = a.Attrezzatura != null ? 
                        new Attrezzatura
                        {
                            Id = a.Id,  
                            Nome = a.Attrezzatura.Nome
                        } : null
                    }).ToList()
                }).ToListAsync();
        }

        // GET: api/Aule/5
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<AulaDto>> GetAula(int id)
        {

            var aula = await GetAulaDto(id);

            if (aula == null)
            {
                return NotFound();
            }

            return aula;
        }

        private async Task<ActionResult<AulaDto>> GetAulaDto(int id)
        {
            var list = await FindAula(id);

            if (list != null)
            {
                if (list.Value != null)
                {
                    if(list.Value.Count() == 1)
                    {
                        return new AulaDto(list.Value.First());
                    } 
                    else if (list.Value.Count() > 1)
                    {
                        return UnprocessableEntity();
                    } else
                    {
                        return NotFound();

                    }
                }
                else
                {
                    return NotFound();
                }
            }
            return NotFound();
        }

        private async Task<ActionResult<IEnumerable<Aula>>?> FindAula(int id)
        {
            if (_context.Aula == null)
            {
                return NotFound();
            }

            return await _context.Aula.Include(p => p.AulaAttrezzatura!)
                .ThenInclude(p => p.Aula).Select(p => new Aula
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    CapienzaMin = p.CapienzaMin,
                    CapienzaMax = p.CapienzaMax,
                    AulaAttrezzatura = p.AulaAttrezzatura!.Select(a => new AulaAttrezzatura
                    {
                        Id = a.Id,
                        Attrezzatura = a.Attrezzatura != null ?
                        new Attrezzatura
                        {
                            Id = a.Attrezzatura.Id,
                            Nome = a.Attrezzatura.Nome
                        } : null
                    }).ToList()
                }).Where(p => p.Id == id).ToListAsync();
        }

        // PUT: api/Aule/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAula(int id, AulaDto aulaDto)
        {
            if (id != aulaDto.Id)
            {
                return BadRequest();
            }

            Aula? aula = Aula.GetFromDto(aulaDto);

            if (aula != null)
            {
                List<AulaAttrezzatura> nuova = new();
                if (aula.AulaAttrezzatura != null)
                {
                    nuova = new List<AulaAttrezzatura>(aula.AulaAttrezzatura);
                }

                _context.Entry(aula).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AulaExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                if (nuova != null)
                {
                    var list = await GetAuleAttrezzature(aula.Id);

                    if (list.Value != null)
                    {
                        List<AulaAttrezzatura> aulaAttrezzaturaDb = list.Value.ToList();

                        foreach (AulaAttrezzatura at in aulaAttrezzaturaDb)
                        {
                            if (!nuova.Any(t => (t.AttrezzaturaId == at.AttrezzaturaId && t.AulaId == at.AulaId)))
                            {
                                _context.AulaAttrezzatura.Remove(at);
                            }
                        }

                        foreach (AulaAttrezzatura at in nuova)
                        {                            
                            if (!aulaAttrezzaturaDb.Any(t => (t.AttrezzaturaId == at.AttrezzaturaId && t.AulaId == at.AulaId)))
                            {
                                _context.AulaAttrezzatura.Add(at);
                            }
                        }
                        await _context.SaveChangesAsync();
                    }
                }
            }
            return NoContent();
        }

        private async Task<ActionResult<IEnumerable<AulaAttrezzatura>>> GetAuleAttrezzature(int AulaId)
        {
            if (_context.AulaAttrezzatura == null)
            {
                return NotFound();
            }

            return await _context.AulaAttrezzatura.Where(p => p.AulaId == AulaId).ToListAsync();
        }

        // POST: api/Aule
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Aula>> PostAula(AulaDto aulaDto)
        {
            if (_context.Aula == null)
            {
                return Problem("Entity set 'AulaRentContext.Aula'  is null.");
            }
            Aula? aula = Aula.GetFromDto(aulaDto);

            if (aula != null)
            {
                List<AulaAttrezzatura> nuova = new();
                if (aula.AulaAttrezzatura != null)
                {
                    nuova = new List<AulaAttrezzatura>(aula.AulaAttrezzatura);
                }
                _context.Aula.Add(aula);
                await _context.SaveChangesAsync();

                if (nuova != null)
                {
                    var list = await GetAuleAttrezzature(aula.Id);

                    if (list.Value != null)
                    {
                        List<AulaAttrezzatura> aulaAttrezzaturaDb = list.Value.ToList();
                        foreach (AulaAttrezzatura at in nuova)
                        {
                            if (!aulaAttrezzaturaDb.Any(t => (t.AttrezzaturaId == at.AttrezzaturaId && t.AulaId == at.AulaId)))
                            {
                                _context.AulaAttrezzatura.Add(at);
                            }
                        }
                        await _context.SaveChangesAsync();
                    }
                }
                return CreatedAtAction("GetAula", new { id = aula.Id }, aula);
            }

            return Problem("Errore nel salvataggio dell'aula");
        }

        // DELETE: api/Aule/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAula(int id)
        {
            if (_context.Aula == null)
            {
                return NotFound();
            }
            var aula = await _context.Aula.FindAsync(id);
            if (aula == null)
            {
                return NotFound();
            }

            _context.Aula.Remove(aula);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AulaExists(int id)
        {
            return (_context.Aula?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
