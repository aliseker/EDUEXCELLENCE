
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
            var secretKey = jwtSettings["SecretKey"];
            
            if (string.IsNullOrEmpty(secretKey))
            {
                throw new InvalidOperationException("JWT SecretKey is not configured. Please set JwtSettings:SecretKey in appsettings.");
            }

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

            // CORS - Dynamic configuration
            var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() 
                ?? new[] { "http://localhost:3000", "https://localhost:3000" };
            
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins(allowedOrigins)
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
            builder.Services.AddSingleton<IHtmlSanitizerService, HtmlSanitizerService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<ICourseService, CourseService>();
            builder.Services.AddScoped<IBlogService, BlogService>();
            builder.Services.AddScoped<IKa2Service, Ka2Service>();
            builder.Services.AddScoped<ISocialMediaService, SocialMediaService>();
            builder.Services.AddScoped<IReviewService, ReviewService>();
            builder.Services.AddScoped<EduExcellence.Application.Interfaces.IHeroService, EduExcellence.Application.Services.HeroService>();
            builder.Services.AddScoped<IMeetingService, MeetingService>();
            builder.Services.AddScoped<IDisseminationService, DisseminationService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddSingleton<IRateLimitService, RateLimitService>();

            var app = builder.Build();

            // Auto Migration (Production'da)
            if (!app.Environment.IsDevelopment())
            {
                using (var scope = app.Services.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<EduExcellenceDbContext>();
                    dbContext.Database.Migrate();
                }
            }

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
                
                // Content Security Policy (CSP) - XSS protection
                context.Response.Headers["Content-Security-Policy"] = 
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                    "style-src 'self' 'unsafe-inline'; " +
                    "img-src 'self' data: https:; " +
                    "font-src 'self' data:; " +
                    "connect-src 'self' https://localhost:* https:; " +
                    "frame-ancestors 'none'; " +
                    "base-uri 'self'; " +
                    "form-action 'self'";

                await next();
            });

            // HTTPS Redirection - Development'da da çalışsın
           // app.UseHttpsRedirection();

            // CORS
            app.UseCors("AllowFrontend");

            // Static files middleware
            app.UseStaticFiles();

            // Development tools - Swagger ONLY in Development
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            // Production'da Swagger kapalı (güvenlik)
            
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}

