using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.BLL.Models;
using API.BLL.Repositories;
using API.BLL.Services;
using API.DAL.Entities;
using API.DAL.Repositories;
using API.DAL.UnitOfWork;
using API.DTO.Requests;
using API.DTO.Responses;
using API.Mappers;
using API.Services;
using AutoMapper;
using Microsoft.Extensions.Logging;

namespace API.BLL.Services
{
    public class RecipeService
    {
        private readonly IRecipeRepository _recipeRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<RecipeService> _logger;

        public RecipeService(
            IRecipeRepository recipeRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<RecipeService> logger
        )
        {
            _recipeRepository = recipeRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<RecipeReviewResponse> AddRecipeReviewAsync(
            Guid recipeId,
            RecipeReviewRequest review
        )
        {
            // ... existing code ...

            // Get the user's name
            var user = await _userRepository.GetByIdAsync(review.UserId);
            var userName = user?.Username ?? user?.Name;

            var reviewEntity = new Review
            {
                Id = Guid.NewGuid(),
                RecipeId = recipeId,
                UserId = review.UserId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserName = userName,
            };

            // ... rest of the code ...

            return new RecipeReviewResponse
            {
                Id = reviewEntity.Id,
                RecipeId = reviewEntity.RecipeId,
                UserId = reviewEntity.UserId,
                Rating = reviewEntity.Rating,
                Comment = reviewEntity.Comment,
                CreatedAt = reviewEntity.CreatedAt,
                UpdatedAt = reviewEntity.UpdatedAt,
                UserName = userName,
            };
        }
    }
}
