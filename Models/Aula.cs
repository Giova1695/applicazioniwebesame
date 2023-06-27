using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations.Schema;
using webapi.Dto;

namespace webapi.Models
{
    public class Aula
    {
      
        public int Id { get; set; }
        public required string Nome { get; set; } = "";
        public int CapienzaMin { get; set; }
        public int CapienzaMax { get; set; }

        public ICollection<AulaAttrezzatura>? AulaAttrezzatura { get; set; }

        public ICollection<Prenotazione> Prenotazioni { get; } = new List<Prenotazione>(); // Collection navigation containing dependents



        public static Aula? GetFromDto(AulaDto dto)
        {
            if (dto != null)
            {
                if (dto.Nome != null)
                {
                    Aula obj = new Aula()
                    {
                        Nome = dto.Nome,
                    };
                    obj.Id = dto.Id;
                    obj.CapienzaMin = dto.CapienzaMin;
                    obj.CapienzaMax = dto.CapienzaMax;
                    if (dto.Attrezzatura != null)
                    {
                        obj.AulaAttrezzatura = new List<AulaAttrezzatura>();
                        foreach (AttrezzaturaDto a in dto.Attrezzatura)
                        {
                            if (a != null)
                            {
                                obj.AulaAttrezzatura.Add(new AulaAttrezzatura(a.Id, obj.Id));
                            }
                        }
                    }
                    return obj;
                }
                return null;
            }
            return null;
        }
    }
}
