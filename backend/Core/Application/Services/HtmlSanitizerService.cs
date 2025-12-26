using System.Text.RegularExpressions;
using Ganss.Xss;
using AngleSharp.Dom;
using EduExcellence.Application.Interfaces;

namespace EduExcellence.Application.Services
{
    /// <summary>
    /// Centralized HTML sanitization to prevent stored XSS.
    /// Use SanitizeRichText for fields rendered as HTML; use SanitizeToPlainText for everything else.
    /// </summary>
    public sealed class HtmlSanitizerService : IHtmlSanitizerService
    {
        private readonly HtmlSanitizer _rich;
        private static readonly Regex MultiSpace = new(@"\s+", RegexOptions.Compiled);
        private static readonly Regex StripTags = new("<[^>]*>", RegexOptions.Compiled);

        public HtmlSanitizerService()
        {
            _rich = new HtmlSanitizer();

            // Reset defaults to a strict allowlist
            _rich.AllowedTags.Clear();
            _rich.AllowedAttributes.Clear();
            _rich.AllowedSchemes.Clear();

            // Allow tags (rich text)
            foreach (var tag in new[]
                     {
                         "p", "br",
                         "strong", "em", "u",
                         "h1", "h2", "h3", "h4", "h5", "h6",
                         "ul", "ol", "li",
                         "blockquote",
                         "code", "pre",
                         "span", "div",
                         "a",
                         "img"
                     })
            {
                _rich.AllowedTags.Add(tag);
            }

            // Allowed attributes (minimal)
            foreach (var attr in new[]
                     {
                         "href", "title",
                         "src", "alt",
                         "target", "rel"
                     })
            {
                _rich.AllowedAttributes.Add(attr);
            }

            // Allowed URI schemes
            _rich.AllowedSchemes.Add("http");
            _rich.AllowedSchemes.Add("https");
            _rich.AllowedSchemes.Add("mailto");

            // Ensure safe rel on links
            _rich.PostProcessNode += (_, e) =>
            {
                if (e.Node is not IElement el)
                    return;

                if (!el.TagName.Equals("A", StringComparison.OrdinalIgnoreCase))
                    return;

                var rel = el.GetAttribute("rel") ?? string.Empty;
                if (!rel.Contains("noopener", StringComparison.OrdinalIgnoreCase))
                    rel = (rel + " noopener").Trim();
                if (!rel.Contains("noreferrer", StringComparison.OrdinalIgnoreCase))
                    rel = (rel + " noreferrer").Trim();

                el.SetAttribute("rel", rel);
            };
        }

        public string SanitizeRichText(string? html)
        {
            if (string.IsNullOrWhiteSpace(html)) return string.Empty;
            return _rich.Sanitize(html);
        }

        public string SanitizeToPlainText(string? html)
        {
            if (string.IsNullOrWhiteSpace(html)) return string.Empty;

            // First sanitize using allowlist to drop scripts/attrs, then remove remaining tags.
            var safe = _rich.Sanitize(html);
            var text = StripTags.Replace(safe, " ");
            return MultiSpace.Replace(text, " ").Trim();
        }
    }
}


