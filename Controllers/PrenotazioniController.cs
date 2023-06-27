using classroomrentauth.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Dto;
using webapi.Models;


namespace webapi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PrenotazioniController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PrenotazioniController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Prenotazioni
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrenotazioneDto>>?> GetPrenotazione()
        {
            return await GetPrenotazioniDtoList();

        }

        private async Task<ActionResult<IEnumerable<PrenotazioneDto>>?> GetPrenotazioniDtoList()
        {
            var list = await GetPrenotazioni();

            if (list != null)
            {
                if (list.Value != null)
                {
                    List<PrenotazioneDto> results = new List<PrenotazioneDto>();

                    foreach (Prenotazione a in list.Value)
                    {
                        results.Add(new PrenotazioneDto(a));
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

        private async Task<ActionResult<IEnumerable<Prenotazione>>> GetPrenotazioni()
        {
            if (_context.Aula == null)
            {
                return NotFound();
            }

            return await _context.Prenotazione.Include(p => p.Aula.AulaAttrezzatura)
                .Select(
                p => new Prenotazione
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Tipo = p.Tipo,
                    PartecipantiMax = p.PartecipantiMax,
                    DataInizio = p.DataInizio,
                    DataFine = p.DataFine,
                    AulaId = p.AulaId,
                    Aula = new Aula()
                    {
                        Id = p.Aula.Id,
                        Nome = p.Aula.Nome,
                        CapienzaMin = p.Aula.CapienzaMin,
                        CapienzaMax = p.Aula.CapienzaMax,
                        AulaAttrezzatura = p.Aula.AulaAttrezzatura!.Select(a => new AulaAttrezzatura
                        {
                            Id = a.Id,
                            Attrezzatura = a.Attrezzatura != null ?
                            new Attrezzatura
                            {
                                Id = a.Attrezzatura.Id,
                                Nome = a.Attrezzatura.Nome
                            } : null
                        }).ToList()
                    }
                }).ToListAsync();
        }

        // GET: api/Prenotazioni/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Responsabile")]
        public async Task<ActionResult<PrenotazioneDto>> GetAula(int id)
        {

            var aula = await GetPrenotazioneDto(id);

            if (aula == null)
            {
                return NotFound();
            }

            return aula;
        }

        private async Task<ActionResult<PrenotazioneDto>> GetPrenotazioneDto(int id)
        {
            var list = await FindPrenotazione(id);

            if (list != null)
            {
                if (list.Value != null)
                {
                    if (list.Value.Count() == 1)
                    {
                        return new PrenotazioneDto(list.Value.First());
                    }
                    else if (list.Value.Count() > 1)
                    {
                        return UnprocessableEntity();
                    }
                    else
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

        private async Task<ActionResult<IEnumerable<Prenotazione>>?> FindPrenotazione(int id)
        {
            if (_context.Prenotazione == null)
            {
                return NotFound();
            }

            return await _context.Prenotazione.Include(p => p.Aula.AulaAttrezzatura)
                .Select(
                p => new Prenotazione
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Tipo = p.Tipo,
                    PartecipantiMax = p.PartecipantiMax,
                    DataInizio = p.DataInizio,
                    DataFine = p.DataFine,
                    AulaId = p.AulaId,
                    Aula = new Aula()
                    {
                        Id = p.Aula.Id,
                        Nome = p.Aula.Nome,
                        CapienzaMin = p.Aula.CapienzaMin,
                        CapienzaMax = p.Aula.CapienzaMax,
                        AulaAttrezzatura = p.Aula.AulaAttrezzatura!.Select(a => new AulaAttrezzatura
                        {
                            Id = a.Id,
                            Attrezzatura = a.Attrezzatura != null ?
                            new Attrezzatura
                            {
                                Id = a.Attrezzatura.Id,
                                Nome = a.Attrezzatura.Nome
                            } : null
                        }).ToList()
                    }
                }).Where(p => p.Id == id).ToListAsync();
}


        // PUT: api/Prenotazioni/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Responsabile")]
        public async Task<IActionResult> PutPrenotazione(int id, PrenotazioneDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            Prenotazione? prenotazione = Prenotazione.GetFromDto(dto);

            if (prenotazione != null)
            {

                _context.Entry(prenotazione).State = EntityState.Modified;


                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PrenotazioneExists(id))
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

        // POST: api/Prenotazioni
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Admin,Responsabile")]
        public async Task<ActionResult<Prenotazione>> PostPrenotazione(PrenotazioneDto dto)
        {
          if (_context.Prenotazione == null)
          {
              return Problem("Entity set 'AulaRentContext.Prenotazione'  is null.");
          }
            Prenotazione? prenotazione = Prenotazione.GetFromDto(dto);

            if (prenotazione != null)
            {
                _context.Prenotazione.Add(prenotazione);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPrenotazione", new { id = prenotazione.Id }, prenotazione);

            }

            return Problem("Errore nel salvataggio della prenotazione");
        }

        // DELETE: api/Prenotazioni/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Responsabile")]
        public async Task<IActionResult> DeletePrenotazione(int id)
        {
            if (_context.Prenotazione == null)
            {
                return NotFound();
            }
            var prenotazione = await _context.Prenotazione.FindAsync(id);
            if (prenotazione == null)
            {
                return NotFound();
            }

            _context.Prenotazione.Remove(prenotazione);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PrenotazioneExists(int id)
        {
            return (_context.Prenotazione?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
