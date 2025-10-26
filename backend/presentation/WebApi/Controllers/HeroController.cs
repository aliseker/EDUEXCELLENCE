using Microsoft.AspNetCore.Mvc;
using EduExcellence.Application.DTOs.Hero;
using EduExcellence.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class HeroController : ControllerBase
    {
        private readonly IHeroService _heroService;

        public HeroController(IHeroService heroService)
        {
            _heroService = heroService;
        }

        [HttpGet("active")]
        public async Task<ActionResult<HeroDto>> GetActiveHero()
        {
            var hero = await _heroService.GetActiveHeroAsync();
            if (hero == null)
                return NotFound("No active hero found");

            return Ok(hero);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<HeroDto>>> GetAllHeroes()
        {
            var heroes = await _heroService.GetAllHeroesAsync();
            return Ok(heroes);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<HeroDto>> GetHeroById(int id)
        {
            var hero = await _heroService.GetHeroByIdAsync(id);
            if (hero == null)
                return NotFound();

            return Ok(hero);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<HeroDto>> CreateHero([FromBody] CreateHeroDto createHeroDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var hero = await _heroService.CreateHeroAsync(createHeroDto);
                return CreatedAtAction(nameof(GetHeroById), new { id = hero.Id }, hero);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<HeroDto>> UpdateHero(int id, [FromBody] UpdateHeroDto updateHeroDto)
        {
            if (id != updateHeroDto.Id)
                return BadRequest("ID mismatch");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var hero = await _heroService.UpdateHeroAsync(updateHeroDto);
                return Ok(hero);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteHero(int id)
        {
            var result = await _heroService.DeleteHeroAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPost("{id}/activate")]
        [Authorize]
        public async Task<ActionResult> SetActiveHero(int id)
        {
            var result = await _heroService.SetActiveHeroAsync(id);
            if (!result)
                return NotFound();

            return Ok(new { message = "Hero activated successfully" });
        }
    }
}
