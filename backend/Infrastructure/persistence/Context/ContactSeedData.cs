using EduExcellence.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EduExcellence.Infrastructure.Persistence.Context
{
    public static class ContactSeedData
    {
        public static void SeedContacts(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Contact>().HasData(
                new Contact
                {
                    Id = 1,
                    Title = "Adres",
                    Type = "address",
                    Details = "[\"Kısla Mah. 37 Sk. Cengizhan Apt. B Girişi No: 6\", \"İç Kapı No: 102 Muratpaşa, Antalya / Türkiye\"]",
                    Order = 1,
                    IsPrimary = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Contact
                {
                    Id = 2,
                    Title = "Telefon",
                    Type = "phone",
                    Details = "[\"+90 505 274 90 36\"]",
                    Order = 2,
                    IsPrimary = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Contact
                {
                    Id = 3,
                    Title = "E-posta",
                    Type = "email",
                    Details = "[\"info@edu-excellence.net\"]",
                    Order = 3,
                    IsPrimary = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );
        }
    }
}



