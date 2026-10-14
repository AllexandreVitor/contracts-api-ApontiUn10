import { ContractService } from "../../src/services/ContractService";
import { redis } from "../../src/config/redis";
import { AppDataSource } from "../../src/config/database";
import { Contract } from "../../src/entities/Contract";

jest.mock("../../src/config/redis", () => ({
  redis: {
    set: jest.fn(),
  },
}));

jest.mock("../../src/config/database", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("ContractService", () => {
  let contractService: ContractService;

  let mockContractRepository: {
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    contractService = new ContractService();

    mockContractRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockContractRepository
    );
  });

  it("should create a contract and save it in database and redis", async () => {
    const mockContract = {
      id: "mocked-uuid",
      title: "Test Contract",
      userId: "user1",
      description: "Test description",
      value: 1000,
      status: "active",
    } as Contract;

    mockContractRepository.create.mockReturnValue(mockContract);
    mockContractRepository.save.mockResolvedValue(mockContract);

    const contract = await contractService.createContract(
      "Test Contract",
      "user1",
      "Test description",
      1000
    );

    expect(mockContractRepository.create).toHaveBeenCalledWith({
      title: "Test Contract",
      userId: "user1",
      description: "Test description",
      value: 1000,
      status: "active",
    });

    expect(mockContractRepository.save).toHaveBeenCalledTimes(1);

    expect(redis.set).toHaveBeenCalledWith(
      "contract:last:user1",
      JSON.stringify(mockContract),
      "EX",
      3600
    );

    expect(contract.status).toBe("active");
  });
});