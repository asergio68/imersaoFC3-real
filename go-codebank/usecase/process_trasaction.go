package usecase

import (
	"encoding/json"
	"os"
	"time"

	"github.com/asergio68/imersaoFC3-real/go-codebank/domain"
	"github.com/asergio68/imersaoFC3-real/go-codebank/dto"
	"github.com/asergio68/imersaoFC3-real/go-codebank/infrastructure/kafka"
	uuid "github.com/satori/go.uuid"
)

type UseCaseTransaction struct {
	TransactionRepository domain.TransactionRepository
	KafkaProducer kafka.KafkaProducer
}

func NewUseCaseTransaction(transactionRepository domain.TransactionRepository) UseCaseTransaction{
	return UseCaseTransaction{TransactionRepository: transactionRepository}
}

func (u UseCaseTransaction) ProcessTransaction(trDto dto.Transaction) (domain.Transaction, error) {
	cc := u.HydrateCreditCard(trDto)
	ccFull, err := u.TransactionRepository.GetCreditCard(*cc)
	if err != nil{
		return domain.Transaction{}, err
	}

	cc.Balance = ccFull.Balance
	cc.Limit = ccFull.Limit
	cc.ID = ccFull.ID

	tr := u.NewTransaction(trDto, ccFull)
	tr.ProcessAndValidate(cc)

	err = u.TransactionRepository.SaveTransaction(*tr,*cc)
	if err != nil {
		return domain.Transaction{}, err
	}

	trDto.ID = tr.ID
	trDto.CreatedAt = tr.CreatedAt
	trDto.Status = tr.Status

	trJson, err := json.Marshal(trDto)
	if err != nil {
		return domain.Transaction{}, err
	}
	err = u.KafkaProducer.Publish(string(trJson), os.Getenv("KafkaTransactionsTopic"))
	if err != nil {
		return domain.Transaction{}, err
	}

	return *tr, nil
}

func (u UseCaseTransaction) HydrateCreditCard(transactionDto dto.Transaction) *domain.CreditCard {
	cc := domain.NewCreditCard()
	cc.Name = transactionDto.Name
	cc.Number = transactionDto.Number
	cc.CVV = transactionDto.CVV
	cc.ExpirationMonth = transactionDto.ExpirationMonth
	cc.ExpirationYear = transactionDto.ExpirationYear
	return cc
}

func (u UseCaseTransaction) NewTransaction(transactionDto dto.Transaction, cc domain.CreditCard) *domain.Transaction {
	t := domain.NewTransaction()
	t.ID = uuid.NewV4().String()
	t.CreditCardID = cc.ID
	t.Amount = transactionDto.Amount
	t.Description = transactionDto.Description
	t.Store = transactionDto.Store
	t.CreatedAt = time.Now()
	return t
}