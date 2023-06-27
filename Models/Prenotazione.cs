using System.Reflection.Metadata;
using webapi.Dto;

namespace webapi.Models
{

    public class Prenotazione
    {
        public int Id { get; set; }
        public required string Nome { get; set; }

        public string Tipo { get; set;}

        public int PartecipantiMax { get; set; }

        public DateTime DataInizio { get; set; }

        public DateTime DataFine { get; set; }

        public int AulaId { get; set; } // Required foreign key property
        public Aula Aula { get; set; } = null!; // Required reference navigation to principale

        public static Prenotazione? GetFromDto(PrenotazioneDto dto)
        {
            if (dto != null)
            {
                if (dto.Nome != null)
                {
                    Prenotazione obj = new Prenotazione()
                    {
                        Nome = dto.Nome,
                    };
                    obj.Id = dto.Id;
                    obj.Nome = dto.Nome;
                    if(dto.Tipo != null)
                    {
                        obj.Tipo = dto.Tipo;
                    } else
                    {
                        obj.Tipo = "";
                    }
                    obj.PartecipantiMax = dto.PartecipantiMax;
                    obj.DataInizio = dto.DataInizio;
                    obj.DataFine = dto.DataFine;
                    obj.AulaId = dto.Aula.Id;
                    //var check = Aula.GetFromDto(dto.Aula);
                    /*
                    if(check != null)
                    {
                        obj.Aula = check;
                    } 
                    else
                    {
                        throw new ArgumentNullException();
                    }*/

                    return obj;
                }
                return null;
            }
            return null;
        }
    }
}
