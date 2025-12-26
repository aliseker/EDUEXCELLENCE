namespace EduExcellence.Application.Interfaces
{
    public interface IHtmlSanitizerService
    {
        string SanitizeRichText(string? html);
        string SanitizeToPlainText(string? html);
    }
}


