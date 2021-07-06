package usecase

import (
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
	
}