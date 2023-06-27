namespace webapi.Models
{
    public class AulaAttrezzatura
    {
        public int Id { get; set; }
        public int AttrezzaturaId { get; set; }
        public int AulaId { get; set; }

        public Attrezzatura? Attrezzatura { get; set; }
        public Aula? Aula { get; set; }

        public AulaAttrezzatura() { }


        public AulaAttrezzatura(int AttrezzaturaId, int AulaId)
        {
            this.AttrezzaturaId = AttrezzaturaId;
            this.AulaId = AulaId;
        }
    }
}
