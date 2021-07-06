package usecase

import (
	"time"

	"github.com/asergio68/imersaoFC3-real/go-codebank/domain"
	"github.com/asergio68/imersaoFC3-real/go-codebank/dto"
)

type UseCaseTransaction struct {
	TransactionRepository domain.TransactionRepository
}

func NewUseCaseTransaction(transactionRepository domain.TransactionRepository) UseCaseTransaction{
	return UseCaseTransaction{TransactionRepository: transactionRepository}
}

func (u UseCaseTransaction) ProcessTransaction(transactionDto dto.Transaction) (domain.Transaction, error) {
	cc := u.HydrateCreditCard(transactionDto)
	ccFull, err := u.TransactionRepository.GetCreditCard(*cc)
	if err != nil{
		return domain.Transaction{}, err
	}
	cc.Balance = ccFull.Balance
	cc.Limit = ccFull.Limit
	cc.ID = ccFull.ID
	tr := u.NewTransaction(transactionDto, ccFull)
	tr.ProcessAndValidate(cc)

	err = u.TransactionRepository.SaveTransaction(*tr,*cc)
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
	t.ID = transactionDto.ID
	t.CreditCardID = cc.ID
	t.Amount = transactionDto.Amount
	t.Description = transactionDto.Description
	t.Store = transactionDto.Store
	t.CreatedAt = time.Now()
	return t
}