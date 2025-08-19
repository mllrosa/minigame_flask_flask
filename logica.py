import random

numero_secreto = random.randint(1, 60)
acertou = False

lista_cameras = [ "video0", "video1", "video3", "video4", "video5", "video6", "video7"]
random.shuffle(lista_cameras)
# print(lista_cameras)

print("Bem-vindo ao jogo de adivinhação!")


for tentativa in range(1, 7):
    try:
        numero_usuario = int(input(f"\nTentativa {tentativa} de 6. Digite um número entre 1 e 60: "))
        

        if not (1 <= numero_usuario <= 60):
            print("O valor precisa estar entre 1 e 60. Tente novamente.")
            continue 

        if numero_usuario == numero_secreto:
            print(f"Parabéns! Você acertou em {tentativa} tentativas!")
            acertou = True
            break
        elif numero_usuario > numero_secreto:
            print("Muito alto. Tente um número menor.")
        else:
            print("Muito baixo. Tente um número maior.")

        if tentativa < 7:
            print(lista_cameras[tentativa - 1])
            

    except ValueError:
        print("Entrada inválida. Por favor, digite um número inteiro.")
        
if not acertou:
    print(f"\nSuas tentativas acabaram. O número secreto era {numero_secreto}.")