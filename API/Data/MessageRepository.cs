using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public void AddMessage(Message message)
        {
           _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
           _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
           var query = _context.Messages
           .OrderByDescending(m => m.MessageSent)
           .AsQueryable();

           query = messageParams.Container switch
           {
            "Inbox" => query.Where(m => m.Recipient.UserName == messageParams.Username),
            "Outbox" => query.Where(m => m.Sender.UserName == messageParams.Username),
            _ => query.Where(m => m.Recipient.UserName == messageParams.Username && m.DateRead == null),
           };

           var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
           return await PagedList<MessageDto>.CreateAsync(messages,messageParams.pageNumber,messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername,string recipentUsername)
        {
            var messages = await _context.Messages
            .Include(u => u.Sender).ThenInclude(p=>p.Photos)
            .Include(u => u.Recipient).ThenInclude(p=>p.Photos)
            .Where(m => m.Recipient.UserName == currentUsername 
            && m.Sender.UserName == recipentUsername
            || m.RecipientUsername == recipentUsername 
            && m.Sender.UserName == currentUsername )
            .OrderBy(m => m.MessageSent)
            .ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRead == null && m.Recipient.UserName == currentUsername).ToList();

            if(unreadMessages.Any())
            {
                foreach(var message in unreadMessages)
                {
                    message.DateRead = DateTime.Now;
                }

                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
            
        }

        public async Task<bool> SaveAllAsync()
        {
           return await _context.SaveChangesAsync() > 0;
        }
    }
}