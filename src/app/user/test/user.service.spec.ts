import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { User } from '../user.model';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  
  let mockUserData: User = new User();
  mockUserData.id = "1"
  mockUserData.email = 'rossgeller@example.com'
  mockUserData.name = 'Ross'
  mockUserData.surname = 'Geller'
  mockUserData.password = '123qweQWE@'

  let mockUpdateData: User = new User();
  mockUpdateData.id = "1"
  mockUpdateData.name = 'UpdatedName';
  mockUpdateData.surname = 'UpdatedSurname';
  mockUpdateData.password = 'UpdatedPassword'; 

  const mockUserList = [
    { id: "1", email: 'rossgeller@example.com', name: 'Ross', surname: 'Geller' },
    { id: "2", email: 'monica@example.com', name: 'Monica', surname: 'Geller' },
    { id: "3", email: 'chandler@example.com', name: 'Chandler', surname: 'Bing' }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            save: jest.fn().mockResolvedValue(mockUserData),
            findOne: jest.fn().mockResolvedValue(mockUserData),
            findAll: jest.fn().mockResolvedValue(mockUserList),
            getUserByEmail: jest.fn().mockResolvedValue(mockUserData),
            update: jest.fn().mockResolvedValue({ ...mockUserData, ...mockUpdateData }),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const result = await userService.save(mockUserData);

      expect(result).toEqual(mockUserData);
      expect(userRepository.save).toHaveBeenCalledWith(mockUserData);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUserData);

      const result = await userService.update(mockUpdateData);

      expect(result).toEqual({ ...mockUserData, ...mockUpdateData });
      expect(userRepository.update).toHaveBeenCalledWith(mockUpdateData);
    });
  });

  describe('getUserById', () => {
    it('should get a user by ID', async () => {
      const result = await userService.findOne(mockUserData.id);

      expect(result).toEqual(mockUserData);
      expect(userRepository.findOne).toHaveBeenCalledWith(mockUserData.id);
    });
  });

   describe('findAllUser', () => {
    it('should get user list', async () => {
      const result = await userService.findAll();

      expect(result).toEqual(mockUserList);
      expect(userRepository.findAll).toHaveBeenCalled(); 
    });
  });

  describe('getUserByEmail', () => {
    it('should get a user by Email', async () => {
      const result = await userService.getUserByEmail(mockUserData.email);

      expect(result).toEqual(mockUserData);
      expect(userRepository.getUserByEmail).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});