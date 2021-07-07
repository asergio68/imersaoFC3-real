package service

import (
	"context"

	"github.com/asergio68/imersaoFC3-real/go-codebank/dto"
	"github.com/asergio68/imersaoFC3-real/go-codebank/infrastructure/grpc/pb"
	"github.com/asergio68/imersaoFC3-real/go-codebank/usecase"
	"github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type TransactionService struct {
	ProcessTransactionUseCase usecase.UseCaseTransaction
	pb.UnimplementedPaymentServiceServer
}

func NewTransactionService() *TransactionService {
	return &TransactionService{};
}

func (ts *TransactionService) Payment(ctx context.Context, in *pb.PaymentRequest) (*empty.Empty, error) {
	tDto := dto.Transaction {
		Name: in.GetCreditCard().GetName(),
		Number: in.GetCreditCard().GetNumber(),
		ExpirationMonth: in.GetCreditCard().GetExpirationMonth(),
		ExpirationYear: in.GetCreditCard().GetExpirationYear(),
		CVV: in.GetCreditCard().GetCvv(),
		Amount: in.GetAmount(),
		Description: in.GetDescription(),
		Store: in.GetStore(),
	}
	tr, err := ts.ProcessTransactionUseCase.ProcessTransaction(tDto)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.FailedPrecondition, err.Error())
	}
	if tr.Status != "approved" {
		return &empty.Empty{}, status.Error(codes.FailedPrecondition, "transaction rejected by the bank")
	}
	return &empty.Empty{}, nil

}