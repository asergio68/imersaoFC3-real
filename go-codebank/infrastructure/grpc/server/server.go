package server

import (
	"log"
	"net"

	"github.com/asergio68/imersaoFC3-real/go-codebank/infrastructure/grpc/pb"
	"github.com/asergio68/imersaoFC3-real/go-codebank/infrastructure/grpc/service"
	"github.com/asergio68/imersaoFC3-real/go-codebank/usecase"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type GRPCServer struct {
	ProcessTransactionUseCase usecase.UseCaseTransaction
}

func NewGRPCServer() GRPCServer {
	return GRPCServer{}
}

func (g *GRPCServer) Serve() {
	lis, err := net.Listen("tcp", "0.0.0.0:50051")
	if err != nil {
		log.Fatal("could not listen tcp port")
	}

	trService := service.NewTransactionService()
	trService.ProcessTransactionUseCase = g.ProcessTransactionUseCase
	gServer := grpc.NewServer()
	reflection.Register(gServer)
	pb.RegisterPaymentServiceServer(gServer, trService)
	gServer.Serve(lis)
}