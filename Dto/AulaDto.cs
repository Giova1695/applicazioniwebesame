using System.Text.Json.Serialization;
using webapi.Models;

namespace webapi.Dto
{
    [JsonSerializable(typeof(AulaDto))]
    public class AulaDto
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public int CapienzaMin { get; set; }
        public int CapienzaMax { get; set; }

        public List<AttrezzaturaDto>? Attrezzatura { get; set; }

        public AulaDto() { }    

        public AulaDto(int Id, string Nome, int CapienzaMin, int CapienzaMax, List<AttrezzaturaDto>? Attrezzatura) {
            this.Id = Id;
            this.Nome = Nome;
            this.CapienzaMin = CapienzaMin;
            this.CapienzaMax = CapienzaMax;
            this.Attrezzatura = Attrezzatura;
        }

        public AulaDto(Aula aula) { 
            if(aula != null)
            {
                Id = aula.Id; 
                Nome = aula.Nome;
                CapienzaMin = aula.CapienzaMin;
                CapienzaMax = aula.CapienzaMax;
                if(aula.AulaAttrezzatura != null)
                {
                    Attrezzatura = new();
                    foreach(AulaAttrezzatura a in aula.AulaAttrezzatura)
                    {
                        if(a.Attrezzatura != null)
                        {
                            Attrezzatura.Add(new AttrezzaturaDto(a.Attrezzatura));
                        }
                    }
                }
            }
        
        }    
    }
}
