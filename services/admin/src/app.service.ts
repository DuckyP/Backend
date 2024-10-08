import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async walkerQueue(): Promise<any> {
    return this.prisma.walker.findMany({
      where: {
        status: 'waitingVerify',
      },
      select: {
        walkerId: true,
        username: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        bankAccountName: true,
        bankAccountNo: true,
        registerAt: true,
        status: true,
      },
    });
  }

  async deleteWalker(msg: any): Promise<any> {
    const walker = await this.prisma.walker.findUnique({
      where: {
        walkerId: msg.walkerId,
      },
      select: {
        walkerId: true,
        username: true,
        email: true,
      },
    });

    if (!walker) {
      throw new Error('Walker not found');
    }

    return this.prisma.walker.delete({
      where: {
        walkerId: msg.walkerId,
      },
      select: {
        walkerId: true,
        username: true,
        email: true,
      },
    });
  }

  async verifyWalker(msg: any): Promise<any> {
    return this.prisma.walker.update({
      where: {
        walkerId: msg.walkerId,
      },
      data: {
        status: 'Active',
        verifyAt: new Date(),
      },
      select: {
        walkerId: true,
        username: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        registerAt: true,
        verifyAt: true,
        status: true,
      },
    });
  }

  async showRequester(): Promise<any> {
    return this.prisma.requester.findMany({
      select: {
        requesterId: true,
        username: true,
        email: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        address: {
          select: {
            name: true,
            detail: true,
            note: true,
            latitude: true,
            longitude: true,
          },
        },
        debitCard: {
          select: {
            cardNumber: true,
            expiryDate: true,
          },
        },
      },
    });
  }

  async showWalker(): Promise<any> {
    return this.prisma.walker.findMany({
      where: {
        status: 'Active',
      },
      select: {
        walkerId: true,
        username: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        bankAccountName: true,
        bankAccountNo: true,
        status: true,
        registerAt: true,
        verifyAt: true,
      },
    });
  }

  async showOrder(): Promise<any> {
    return this.prisma.order.findMany({
      select: {
        orderId: true,
        amount: true,
        totalPrice: true,
        shippingFee: true,
        orderStatus: true,
        address: {
          select: {
            name: true,
            latitude: true,
            longitude: true,
          },
        },
        canteen: {
          select: {
            name: true,
            latitude: true,
            longitude: true,
          },
        },
        requester: {
          select: {
            username: true,
          },
        },
        walker: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  async postApproval(msg: any): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: {
        orderId: msg.orderId,
      },
      select: {
        orderId: true,
        orderStatus: true,
      },
    });

    if (!order || order.orderStatus !== 'waitingAdmin') {
      throw new Error('Order not found or status is not "waiting admin".');
    }

    return this.prisma.order.update({
      where: {
        orderId: msg.orderId,
      },
      data: {
        orderStatus: msg.orderStatus,
        confirmedAt: new Date(),
      },
      select: {
        orderId: true,
        orderStatus: true,
        confirmedAt: true,
      },
    });
  }
}
