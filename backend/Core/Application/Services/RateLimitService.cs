using System.Collections.Concurrent;

namespace EduExcellence.Application.Services
{
    public interface IRateLimitService
    {
        bool IsAllowed(string key, int maxAttempts = 5, TimeSpan? window = null);
        void Clear(string key);
    }

    public class RateLimitService : IRateLimitService
    {
        private readonly ConcurrentDictionary<string, List<DateTime>> _requestLog = new();
        private readonly object _cleanupLock = new();
        private DateTime _lastCleanup = DateTime.UtcNow;

        public bool IsAllowed(string key, int maxAttempts = 5, TimeSpan? window = null)
        {
            var timeWindow = window ?? TimeSpan.FromMinutes(15);
            var now = DateTime.UtcNow;

            // Cleanup old entries periodically
            PeriodicCleanup();

            var requests = _requestLog.GetOrAdd(key, _ => new List<DateTime>());

            lock (requests)
            {
                // Remove old requests outside the time window
                requests.RemoveAll(r => now - r > timeWindow);

                // Check if limit exceeded
                if (requests.Count >= maxAttempts)
                {
                    return false;
                }

                // Add current request
                requests.Add(now);
                return true;
            }
        }

        public void Clear(string key)
        {
            _requestLog.TryRemove(key, out _);
        }

        private void PeriodicCleanup()
        {
            lock (_cleanupLock)
            {
                if (DateTime.UtcNow - _lastCleanup > TimeSpan.FromHours(1))
                {
                    var keysToRemove = _requestLog
                        .Where(kvp => !kvp.Value.Any() || DateTime.UtcNow - kvp.Value.Max() > TimeSpan.FromHours(24))
                        .Select(kvp => kvp.Key)
                        .ToList();

                    foreach (var key in keysToRemove)
                    {
                        _requestLog.TryRemove(key, out _);
                    }

                    _lastCleanup = DateTime.UtcNow;
                }
            }
        }
    }
}


