using webapi.Dto;

namespace webapi.Models
{
    public class Attrezzatura
    {
        public int Id { get; set; }

        public required string Nome { get; set; }

        public ICollection<AulaAttrezzatura>? AulaAttrezzatura { get; set; }


        public static Attrezzatura? GetFromDto(AttrezzaturaDto dto)
        {
            if (dto != null)
            {
                if (dto.Nome != null)
                {
                    Attrezzatura obj = new()
                    {
                        Nome = dto.Nome,
                        Id = dto.Id
                    };

                    return obj;
                }
                return null;
            }
            return null;
        }
    }
}
