using classroomrentauth.Models;
using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;
using webapi.Dto;

namespace classroomrentauth.Dto
{
    [JsonSerializable(typeof(UtenteDto))]
    public class UtenteDto
    {
        public string Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public List<String>? Ruoli { get; set; }

        public UtenteDto() { }

        public UtenteDto(string id, string? username, string? email, List<string>? ruoli)
        {
            Id = id;
            Username = username;
            Email = email;
            Ruoli = ruoli;
        }       

        public UtenteDto(ApplicationUser applicationUser, List<IdentityRole> roles) { 
            Id = applicationUser.Id;
            Username = applicationUser.UserName;
            Email = applicationUser.Email;
            Ruoli = new();
            foreach(var role in roles)
            {
                Ruoli.Add(role.Name);
            }

        }    

    }
}
