package pwr.jakprzyjade.inferius;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import pwr.jakprzyjade.inferius.creditcardinfo.controller.CreditCardInfoController;
import pwr.jakprzyjade.inferius.creditcardinfo.database.CreditCardDto;
import pwr.jakprzyjade.inferius.creditcardinfo.service.CreditCardInfoService;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class CreditCardInfoControllerTest {

    @InjectMocks
    private CreditCardInfoController creditCardInfoController;

    @Mock
    private CreditCardInfoService creditCardInfoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getCreditCards_ShouldReturnListOfCards() {
        String userId = UUID.randomUUID().toString();
        List<CreditCardDto> mockCards = List.of(
                new CreditCardDto(UUID.randomUUID(), "Card 1", "1234567890123456", "John Doe", "12/25"),
                new CreditCardDto(UUID.randomUUID(), "Card 2", "6543210987654321", "Jane Doe", "11/24")
        );

        when(creditCardInfoService.getCreditCards(userId)).thenReturn(mockCards);

        ResponseEntity<List<CreditCardDto>> response = creditCardInfoController.getCreditCards(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void getCreditCards_ShouldHandleEmptyList() {
        String userId = UUID.randomUUID().toString();

        when(creditCardInfoService.getCreditCards(userId)).thenReturn(List.of());

        ResponseEntity<List<CreditCardDto>> response = creditCardInfoController.getCreditCards(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void getCreditCards_ShouldThrowExceptionForInvalidUserId() {
        String invalidUserId = "invalid-uuid";

        when(creditCardInfoService.getCreditCards(invalidUserId))
                .thenThrow(new IllegalArgumentException("Invalid user ID format."));

        try {
            creditCardInfoController.getCreditCards(invalidUserId);
        } catch (IllegalArgumentException e) {
            assertEquals("Invalid user ID format.", e.getMessage());
        }
    }
}
