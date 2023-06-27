
using System.Text.Json.Serialization;
using webapi.Models;

namespace webapi.Dto
{
    [JsonSerializable(typeof(AulaDto))]
    public class AttrezzaturaDto
    {
        public int Id { get; set; }

        public string? Nome { get; set; }

        public AttrezzaturaDto()
        {

        }

        public AttrezzaturaDto(int id, string? nome)
        {
            Id = id;
            Nome = nome;
        }  

        public AttrezzaturaDto(Attrezzatura attrezzatura)
        {
            if(attrezzatura != null)
            {
                Id = attrezzatura.Id;
                Nome = attrezzatura.Nome;
            } else
            {
                Id = 0;
                Nome = null;
            }
        }
    }
}
