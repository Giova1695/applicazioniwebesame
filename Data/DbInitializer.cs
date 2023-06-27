using classroomrentauth.Data;
using System.Diagnostics;
using webapi.Models;

namespace webapi.Data
{
    public class DbInitializer
    {

        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            // Look for any students.
            if (context.Attrezzatura.Any())
            {
                return;   // DB has been seeded
            }

            
            var attrezzature = new Attrezzatura[]
            {
            new Attrezzatura{Nome="Lavagna"},
            new Attrezzatura{Nome="Proiettore"},
            new Attrezzatura{Nome="Microscopio"},
            new Attrezzatura{Nome="Lavagna Elettronica"}
            };
            foreach (Attrezzatura s in attrezzature)
            {
                context.Attrezzatura.Add(s);
            }
            context.SaveChanges();

            var courses = new Aula[]
            {
            new Aula{Nome="Aula 1", CapienzaMin=5, CapienzaMax=10},
            new Aula{Nome="Aula 2", CapienzaMin=5, CapienzaMax=10},
            new Aula{Nome="Aula 3", CapienzaMin=5, CapienzaMax=10}
            };
            foreach (Aula c in courses)
            {
                context.Aula.Add(c);
            }
            context.SaveChanges();

            var enrollments = new AulaAttrezzatura[]
            {
            new AulaAttrezzatura{AttrezzaturaId=1,AulaId=1},
            new AulaAttrezzatura{AttrezzaturaId=2,AulaId=1},
            new AulaAttrezzatura{AttrezzaturaId=3,AulaId=1}
            };
            foreach (AulaAttrezzatura e in enrollments)
            {
                context.AulaAttrezzatura.Add(e);
            }
            context.SaveChanges();

            var prenotazioni = new Prenotazione[]
            {
                new Prenotazione{Nome = "Lezione Scienze", Tipo = "Lezione", PartecipantiMax=30, DataInizio=new DateTime(2023, 6, 24, 8, 0, 0, DateTimeKind.Local),
                DataFine=new DateTime(2023, 6, 24, 10, 0, 0, DateTimeKind.Local), AulaId=1 },
                new Prenotazione{Nome = "Lezione Storia", Tipo = "Lezione", PartecipantiMax=30, DataInizio=new DateTime(2023, 6, 24, 10, 0, 0, DateTimeKind.Local),
                DataFine=new DateTime(2023, 6, 24, 12, 0, 0, DateTimeKind.Local), AulaId=2 }
            };
            foreach (Prenotazione e in prenotazioni)
            {
                context.Prenotazione.Add(e);
            }
            context.SaveChanges();
        }
    }
}
