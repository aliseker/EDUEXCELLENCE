
using EduExcellence.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using EduExcellence.Application.Interfaces;
using EduExcellence.Application.Services;
using EduExcellence.Domain.Interfaces;
using EduExcellence.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.HttpOverrides;
using EduExcellence.WebApi.Middleware;

namespace EduExcellence.WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Security Headers
            builder.Services.AddHsts(options =>
            {
                options.Preload = true;
                options.IncludeSubDomains = true;
                options.MaxAge = TimeSpan.FromDays(365);
            });

            // HTTPS Redirection
            builder.Services.AddHttpsRedirection(options =>
            {
                options.RedirectStatusCode = StatusCodes.Status308PermanentRedirect;
                options.HttpsPort = 443;
            });

            // Rate Limiting kaldırıldı

            // Database
            builder.Services.AddDbContext<EduExcellenceDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), 
                    b => b.MigrationsAssembly("persistence")));

            // JWT Authentication
            var jwtSettings = builder.Configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "your-super-secret-key-that-is-at-least-32-characters-long";

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtSettings["Issuer"] ?? "EduExcellence",
                        ValidAudience = jwtSettings["Audience"] ?? "EduExcellenceUsers",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
                    };
                });

            // CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            // Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new() { Title = "Edu Excellence API", Version = "v1" });
                
                // Add JWT authentication to Swagger
                c.AddSecurityDefinition("Bearer", new()
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme."
                });
                
                c.AddSecurityRequirement(new()
                {
                    {
                        new()
                        {
                            Reference = new()
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            // AutoMapper
            builder.Services.AddAutoMapper(cfg => {
                cfg.AddProfile<EduExcellence.Application.Mappings.HeroMappingProfile>();
            });

            // Register services
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<ICourseService, CourseService>();
            builder.Services.AddScoped<IBlogService, BlogService>();
            builder.Services.AddScoped<IKa2Service, Ka2Service>();
            builder.Services.AddScoped<ISocialMediaService, SocialMediaService>();
            builder.Services.AddScoped<IReviewService, ReviewService>();
            builder.Services.AddScoped<EduExcellence.Application.Interfaces.IHeroService, EduExcellence.Application.Services.HeroService>();
            builder.Services.AddScoped<IMeetingService, MeetingService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            
            // Rate Limiting kaldırıldı
            
            // Global Exception Handling - Rate limiting'den sonra
            app.UseMiddleware<GlobalExceptionMiddleware>();
            
            // Security Headers - En üstte olmalı
            app.Use(async (context, next) =>
            {
                // HSTS Header
                if (!context.Request.IsHttps && !app.Environment.IsDevelopment())
                {
                    context.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload";
                }

                // Security Headers
                context.Response.Headers["X-Content-Type-Options"] = "nosniff";
                context.Response.Headers["X-Frame-Options"] = "DENY";
                context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
                context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
                context.Response.Headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()";

                await next();
            });

            // HTTPS Redirection - Development'da da çalışsın
            app.UseHttpsRedirection();

            // CORS
            app.UseCors("AllowFrontend");

            // Static files middleware
            app.UseStaticFiles();

            // Development tools
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                // Production'da Swagger'ı kapat
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Edu Excellence API v1");
                    c.RoutePrefix = string.Empty; // Swagger UI'ı root'ta göster
                });
            }
            
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}

