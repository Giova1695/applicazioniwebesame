using System.Text.Json.Serialization;
using webapi.Models;

namespace webapi.Dto
{
    [JsonSerializable(typeof(PrenotazioneDto))]
    public class PrenotazioneDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Tipo { get; set; }
        public int PartecipantiMax { get; set; }

        public DateTime DataInizio { get; set; }

        public DateTime DataFine { get; set; }

        public AulaDto Aula { get; set; }

        public PrenotazioneDto() {
            Id = 0;
            Nome = "";
            Tipo = "";
            PartecipantiMax = 0;
            Aula = new AulaDto();
        }

        public PrenotazioneDto(int Id, string Nome, string Tipo, int MaxPartecipanti, DateTime DataInizio, DateTime DataFine, AulaDto Aula)
        {
            this.Id = Id;
            this.Nome = Nome;
            this.Tipo = Tipo;
            this.PartecipantiMax = MaxPartecipanti;
            this.DataInizio = DataInizio;
            this.DataFine = DataFine;
            this.Aula = Aula;
        }

        public PrenotazioneDto(Prenotazione obj)
        {
            if (obj != null)
            {
                Id = obj.Id;
                if(obj.Nome != null)
                {
                    Nome = obj.Nome;
                } else
                {
                    Nome = "";
                }
                Tipo = obj.Tipo;
                PartecipantiMax = obj.PartecipantiMax;
                DataInizio = obj.DataInizio;
                DataFine = obj.DataFine;    
                Aula = new AulaDto(obj.Aula);
            } 
            else
            {
                Id = 0;
                Nome = "";
                Tipo = "";
                PartecipantiMax = 0;
                Aula = new AulaDto();
            }
        }
    }
}
