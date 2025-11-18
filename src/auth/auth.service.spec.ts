import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from 'generated/prisma/client';

// --- 1. MOCKS (Nossos Atores Dublês) ---
// Aqui criamos versões falsas dos serviços que o AuthService usa.
// Não queremos usar o banco de dados real nem enviar e-mails reais no teste!

const mockUserService = {
  findByEmail: jest.fn(), // Função vazia que vamos configurar em cada teste
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(() => 'token_falso_gerado_no_teste'), // Sempre retorna isso
};

const mockPrismaService = {
  user: { findUnique: jest.fn(), update: jest.fn() }, // Simulando o Prisma
};

const mockMailerService = {
  sendMail: jest.fn(),
};

// --- 2. O TESTE ---
describe('AuthService', () => {
  let service: AuthService;
  let userService: typeof mockUserService;

  // Antes de cada teste (it), o Nest "monta" o ambiente falso
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        // Aqui injetamos os dublês no lugar dos reais
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
  });

  // Limpa os mocks depois de cada teste para não sobrar lixo
  afterEach(() => {
    jest.clearAllMocks();
  });

  // === CENÁRIO 1: LOGIN COM SUCESSO ===
  it('deve retornar um token de acesso se as credenciais forem válidas', async () => {
    // ARRANGE (Preparação)
    const loginDto = { email: 'teste@email.com', password: '123' };
    
    // Simulamos que o UserService encontrou um usuário no banco
    const userNoBanco = { 
      id: 1, 
      email: 'teste@email.com', 
      password: 'hash_da_senha_correta', // Senha criptografada
      role: 'CLIENT' 
    };
    userService.findByEmail.mockResolvedValue(userNoBanco);

    // Simulamos que o Bcrypt disse "A senha bate!" (True)
    // (Interceptamos a função compare do bcrypt)
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

    // ACT (Ação)
    const result = await service.login(loginDto);

    // ASSERT (Verificação)
    expect(result).toEqual({ accessToken: 'token_falso_gerado_no_teste' });
    expect(userService.findByEmail).toHaveBeenCalledWith('teste@email.com');
  });

  // === CENÁRIO 2: SENHA ERRADA ===
  it('deve lançar UnauthorizedException se a senha estiver incorreta', async () => {
    // ARRANGE
    const loginDto = { email: 'teste@email.com', password: 'senha_errada' };
    
    const userNoBanco = { 
      id: 1, 
      email: 'teste@email.com', 
      password: 'hash_da_senha_correta',
      role: 'CLIENT'
    };
    userService.findByEmail.mockResolvedValue(userNoBanco);

    // Simulamos que o Bcrypt disse "Senha errada!" (False)
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

    // ACT & ASSERT
    // Esperamos que a chamada rejeite com o erro específico
    await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
  });

  // === CENÁRIO 3: E-MAIL NÃO EXISTE ===
  it('deve lançar UnauthorizedException se o usuário não for encontrado', async () => {
    // ARRANGE
    const loginDto = { email: 'inexistente@email.com', password: '123' };

    // Simulamos que o UserService NÃO achou ninguém (null)
    userService.findByEmail.mockResolvedValue(null);

    // ACT & ASSERT
    await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
  });

  // === CENÁRIO 4: REGISTRO COM SUCESSO ===
  it('deve registrar um novo usuário com sucesso e retornar os dados do usuário criado', async () => {
    // ARRANGE (Preparação)
    const registerDto = {
      name: 'Novo Cliente',
      email: 'novo@cliente.com',
      password: 'senhaSegura123',
      phone: '11987654321'
    };
    
    // Simulamos que findByEmail não encontrou nenhum usuário (significa que o e-mail está livre)
    userService.findByEmail.mockResolvedValue(null);

    // Simulamos que o create do UserService criou o usuário com sucesso
    const userCriado = {
      id: 2,
      name: registerDto.name,
      email: registerDto.email,
      password: 'hash_da_senha_nova',
      phone: registerDto.phone,
      role: Role.CLIENT, // Garante que a role é CLIENT
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordResetToken: null,
      passwordResetTokenExpires: null,
      profileImageUrl: null,
    };
    userService.create.mockResolvedValue(userCriado);

    // ACT (Ação)
    const result = await service.register(registerDto);

    // ASSERT (Verificação)
    // Verificamos se a função findByEmail foi chamada para checar duplicidade
    expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email);
    // Verificamos se a função create do UserService foi chamada com os dados e a role correta
    expect(userService.create).toHaveBeenCalledWith(registerDto, Role.CLIENT);
    // Verificamos se o resultado é o usuário que simulamos ter sido criado
    expect(result).toEqual(userCriado);
    // Podemos verificar se o password não é retornado em texto claro (já que mockamos o hash)
    expect(result).not.toHaveProperty('password');
  });

  // === CENÁRIO 5: TENTATIVA DE REGISTRO COM E-MAIL JÁ CADASTRADO ===
  it('deve lançar ConflictException se o e-mail já estiver cadastrado', async () => {
    // ARRANGE (Preparação)
    const registerDto = {
      name: 'Cliente Existente',
      email: 'existente@cliente.com',
      password: 'senhaQualquer',
      phone: '11999999999'
    };

    // Simulamos que findByEmail ENCONTROU um usuário (e-mail já existe)
    userService.findByEmail.mockResolvedValue({ 
      id: 1, 
      email: registerDto.email, 
      password: 'hash_existente', 
      role: Role.CLIENT 
    });

    // ACT & ASSERT (Ação e Verificação)
    // Esperamos que a chamada rejeite com o erro ConflictException
    await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    // Verificamos se findByEmail foi chamado
    expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email);
    // Verificamos que userService.create NUNCA foi chamado (porque a validação de e-mail duplicado impediu)
    expect(userService.create).not.toHaveBeenCalled();
  });

  // === CENÁRIO 6: Erro interno no UserService.create ===
  // Embora o erro seja lançado pelo UserService, o AuthService deve propagar
  it('deve propagar um erro se o UserService.create falhar', async () => {
    // ARRANGE
    const registerDto = {
      name: 'Problema no DB',
      email: 'erro@db.com',
      password: 'senha',
      phone: '11111111111'
    };

    userService.findByEmail.mockResolvedValue(null);
    // Simulamos que o create do UserService falhou (ex: erro no banco de dados, validação interna)
    userService.create.mockRejectedValue(new Error('Erro de banco de dados simulado'));

    // ACT & ASSERT
    await expect(service.register(registerDto)).rejects.toThrow('Erro de banco de dados simulado');
    expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email);
    expect(userService.create).toHaveBeenCalledWith(registerDto, Role.CLIENT);
  });
});
